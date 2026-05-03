package in.vivekpramanik.stay_hydrated_backend.service;

import in.vivekpramanik.stay_hydrated_backend.dto.stats.TodayStatsResponse;
import in.vivekpramanik.stay_hydrated_backend.dto.stats.WeeklyStatsResponse;
import in.vivekpramanik.stay_hydrated_backend.entity.DailyStats;
import in.vivekpramanik.stay_hydrated_backend.entity.IntakeLog;
import in.vivekpramanik.stay_hydrated_backend.entity.UserGoal;
import in.vivekpramanik.stay_hydrated_backend.mapper.StatsMapper;
import in.vivekpramanik.stay_hydrated_backend.repository.DailyStatsRepository;
import in.vivekpramanik.stay_hydrated_backend.repository.IntakeLogRepository;
import in.vivekpramanik.stay_hydrated_backend.repository.UserGoalRepository;
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
public class StatsService {
    @Autowired
    private final DailyStatsRepository dailyStatsRepository;
    @Autowired
    private final IntakeLogRepository intakeLogRepository;
    @Autowired
    private final UserGoalRepository userGoalRepository;
    @Autowired
    private final StatsMapper statsMapper;

    public TodayStatsResponse getToday() {
        UUID userId = SecurityUtils.getCurrentUserId();
        LocalDate today = LocalDate.now();

        DailyStats stats = dailyStatsRepository.findByUserIdAndDate(userId, today)
                .orElseGet(() -> emptyStats(userId, today));

        List<IntakeLog> todayLogs = intakeLogRepository
                .findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .filter(log -> log.getCreatedAt().toLocalDate().equals(today))
                .collect(Collectors.toList());

        return statsMapper.toTodayResponse(stats, todayLogs);

    }

    public WeeklyStatsResponse getWeekly() {
        UUID userId = SecurityUtils.getCurrentUserId();

        List<DailyStats> last7 = dailyStatsRepository
                .findTop7ByUserIdOrderByDateDesc(userId);

        return statsMapper.toWeeklyResponse(last7);
    }

    private DailyStats emptyStats(UUID userId, LocalDate date) {
        int goalMl = userGoalRepository.findLatestGoal(userId)
                .map(UserGoal::getDailyGoal)
                .orElse(2000);

        DailyStats empty = new DailyStats();
        empty.setDate(date);
        empty.setTotalIntakeMl(0);
        empty.setGoalMl(goalMl);
        empty.setCompletionPercentage(0);
        return empty;
    }

}
