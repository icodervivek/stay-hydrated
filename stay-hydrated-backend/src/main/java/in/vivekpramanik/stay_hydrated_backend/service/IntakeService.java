package in.vivekpramanik.stay_hydrated_backend.service;


import in.vivekpramanik.stay_hydrated_backend.dto.intake.IntakeRequest;
import in.vivekpramanik.stay_hydrated_backend.dto.intake.IntakeResponse;
import in.vivekpramanik.stay_hydrated_backend.dto.stats.IntakeLogEntry;
import in.vivekpramanik.stay_hydrated_backend.entity.*;
import in.vivekpramanik.stay_hydrated_backend.exception.UserNotFoundException;
import in.vivekpramanik.stay_hydrated_backend.mapper.IntakeMapper;
import in.vivekpramanik.stay_hydrated_backend.repository.*;
import in.vivekpramanik.stay_hydrated_backend.util.SecurityUtils;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class IntakeService {

    private final IntakeLogRepository intakeLogRepository;
    private final DailyStatsRepository dailyStatsRepository;
    private final UserGoalRepository userGoalRepository;
    private final UserStreakRepository userStreakRepository;
    private final AchievementRepository achievementRepository;
    private final UserAchievementRepository userAchievementRepository;
    private final UserRepository userRepository;
    private final IntakeMapper intakeMapper;

    @Transactional
    public IntakeResponse addIntake(IntakeRequest request) {
        UUID userId = SecurityUtils.getCurrentUserId();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        // Step 1: save intake log
        IntakeLog log = new IntakeLog();
        log.setUser(user);
        log.setAmountMl(request.getAmountMl());
        log.setImageUrl(request.getImageUrl());
        log.setAiLabel(request.getAiLabel());
        IntakeLog savedLog = intakeLogRepository.save(log);

        // Step 2: upsert daily stats
        DailyStats stats = upsertDailyStats(user, userId, request.getAmountMl());

        // Step 3: update streak
        UserStreak streak = updateStreak(user, userId);

        // Step 4: check and unlock achievements
        checkAchievements(userId, user, streak, stats);

        return intakeMapper.toResponse(savedLog, stats);
    }

    private DailyStats upsertDailyStats(User user, UUID userId, int amountMl) {
        LocalDate today = LocalDate.now();

        int goalMl = userGoalRepository.findLatestGoal(userId)
                .map(UserGoal::getDailyGoal)
                .orElse(2000);

        DailyStats stats = dailyStatsRepository.findByUserIdAndDate(userId, today)
                .orElseGet(() -> {
                    DailyStats s = new DailyStats();
                    s.setUser(user);
                    s.setDate(today);
                    s.setTotalIntakeMl(0);
                    return s;
                });

        stats.setTotalIntakeMl(stats.getTotalIntakeMl() + amountMl);
        stats.setGoalMl(goalMl);
        stats.setCompletionPercentage(Math.min(100, (stats.getTotalIntakeMl() * 100) / goalMl));

        return dailyStatsRepository.save(stats);
    }

    private UserStreak updateStreak(User user, UUID userId) {
        LocalDate today = LocalDate.now();

        UserStreak streak = userStreakRepository.findByUserId(userId).orElseGet(() -> {
            UserStreak s = new UserStreak();
            s.setUser(user);
            return s;
        });

        LocalDate lastLogged = streak.getLastLoggedDate();

        if (lastLogged == null) {
            streak.setCurrentStreak(1);
            streak.setLongestStreak(1);
        } else if (lastLogged.equals(today)) {
            // already logged today, streak unchanged
            return streak;
        } else if (lastLogged.equals(today.minusDays(1))) {
            int updated = streak.getCurrentStreak() + 1;
            streak.setCurrentStreak(updated);
            if (updated > streak.getLongestStreak()) {
                streak.setLongestStreak(updated);
            }
        } else {
            // streak broken
            streak.setCurrentStreak(1);
        }

        streak.setLastLoggedDate(today);
        return userStreakRepository.save(streak);
    }

    private void checkAchievements(UUID userId, User user, UserStreak streak, DailyStats stats) {
        List<Achievement> all = achievementRepository.findAll();

        for (Achievement achievement : all) {
            if (userAchievementRepository.existsByUserIdAndAchievementId(userId, achievement.getId())) {
                continue;
            }

            boolean unlocked = switch (achievement.getConditionType()) {
                case "STREAK" -> streak.getCurrentStreak() >= achievement.getConditionValue();
                case "DAILY_GOAL" -> stats.getCompletionPercentage() >= achievement.getConditionValue();
                default -> false;
            };

            if (unlocked) {
                UserAchievement ua = new UserAchievement();
                ua.setUser(user);
                ua.setAchievement(achievement);
                userAchievementRepository.save(ua);
            }
        }
    }

    public Page<IntakeLogEntry> getHistory(int page, int size) {
        UUID userId = SecurityUtils.getCurrentUserId();
        PageRequest pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return intakeLogRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable)
                .map(log -> new IntakeLogEntry(
                        log.getId(),
                        log.getAmountMl(),
                        log.getImageUrl(),
                        log.getAiLabel(),
                        log.getCreatedAt()
                ));
    }
}
