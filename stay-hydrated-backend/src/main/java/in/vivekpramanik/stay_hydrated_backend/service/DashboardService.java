package in.vivekpramanik.stay_hydrated_backend.service;

import in.vivekpramanik.stay_hydrated_backend.dto.dashboard.DashboardResponse;
import in.vivekpramanik.stay_hydrated_backend.entity.*;
import in.vivekpramanik.stay_hydrated_backend.exception.UserNotFoundException;
import in.vivekpramanik.stay_hydrated_backend.mapper.DashboardMapper;
import in.vivekpramanik.stay_hydrated_backend.repository.*;
import in.vivekpramanik.stay_hydrated_backend.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {
    @Autowired
    private final UserRepository userRepository;
    @Autowired
    private final DailyStatsRepository dailyStatsRepository;
    @Autowired
    private final UserStreakRepository userStreakRepository;
    @Autowired
    private final UserGoalRepository userGoalRepository;
    @Autowired
    private final IntakeLogRepository intakeLogRepository;
    @Autowired
    private final DashboardMapper dashboardMapper;

    public DashboardResponse getDashboard() {
        UUID userId = SecurityUtils.getCurrentUserId();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        DailyStats todayStats = dailyStatsRepository
                .findByUserIdAndDate(userId, LocalDate.now())
                .orElseGet(() -> emptyStats(userId));

        UserStreak streak = userStreakRepository.findById(userId)
                .orElseGet(UserStreak::new);

        List<IntakeLog> recentLogs = intakeLogRepository
                .findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .limit(5)
                .collect(Collectors.toList());

        return dashboardMapper.toResponse(user, todayStats, streak, recentLogs);
    }

    private DailyStats emptyStats(UUID userId) {
        int goalMl = userGoalRepository.findLatestGoal(userId)
                .map(UserGoal::getDailyGoal)
                .orElse(2000);

        DailyStats empty = new DailyStats();
        empty.setDate(LocalDate.now());
        empty.setTotalIntakeMl(0);
        empty.setGoalMl(goalMl);
        empty.setCompletionPercentage(0);
        return empty;
    }

}
