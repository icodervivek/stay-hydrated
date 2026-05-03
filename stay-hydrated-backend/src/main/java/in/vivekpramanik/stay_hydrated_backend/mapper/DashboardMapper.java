package in.vivekpramanik.stay_hydrated_backend.mapper;

import in.vivekpramanik.stay_hydrated_backend.dto.dashboard.DashboardResponse;
import in.vivekpramanik.stay_hydrated_backend.dto.dashboard.RecentLogEntry;
import in.vivekpramanik.stay_hydrated_backend.dto.stats.DayStatsEntry;
import in.vivekpramanik.stay_hydrated_backend.entity.DailyStats;
import in.vivekpramanik.stay_hydrated_backend.entity.IntakeLog;
import in.vivekpramanik.stay_hydrated_backend.entity.User;
import in.vivekpramanik.stay_hydrated_backend.entity.UserStreak;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class DashboardMapper {

    public DashboardResponse toResponse(User user, DailyStats stats,
                                        UserStreak streak, List<IntakeLog> recentLogs) {
        List<RecentLogEntry> logEntries = recentLogs.stream()
                .map(log -> new RecentLogEntry(
                        log.getId(),
                        log.getAmountMl(),
                        log.getAiLabel(),
                        log.getCreatedAt()))
                .collect(Collectors.toList());

        return new DashboardResponse(
                user.getName(),
                stats.getTotalIntakeMl(),
                stats.getGoalMl(),
                stats.getCompletionPercentage(),
                streak.getCurrentStreak(),
                streak.getLongestStreak(),
                logEntries
        );
    }
}