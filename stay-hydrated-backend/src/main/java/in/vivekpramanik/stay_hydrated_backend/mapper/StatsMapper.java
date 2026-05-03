package in.vivekpramanik.stay_hydrated_backend.mapper;

import in.vivekpramanik.stay_hydrated_backend.dto.stats.DayStatsEntry;
import in.vivekpramanik.stay_hydrated_backend.dto.stats.IntakeLogEntry;
import in.vivekpramanik.stay_hydrated_backend.dto.stats.TodayStatsResponse;
import in.vivekpramanik.stay_hydrated_backend.dto.stats.WeeklyStatsResponse;
import in.vivekpramanik.stay_hydrated_backend.entity.DailyStats;
import in.vivekpramanik.stay_hydrated_backend.entity.IntakeLog;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class StatsMapper {
    public TodayStatsResponse toTodayResponse(DailyStats stats, List<IntakeLog> logs) {
        List<IntakeLogEntry> entries = logs.stream()
                .map(log -> new IntakeLogEntry(
                        log.getId(),
                        log.getAmountMl(),
                        log.getImageUrl(),
                        log.getAiLabel(),
                        log.getCreatedAt()))
                .collect(Collectors.toList());

        return new TodayStatsResponse(
                stats.getDate(),
                stats.getTotalIntakeMl(),
                stats.getGoalMl(),
                stats.getCompletionPercentage(),
                entries
        );
    }

    public WeeklyStatsResponse toWeeklyResponse(List<DailyStats> statsList) {
        List<DayStatsEntry> days = statsList.stream()
                .map(s -> new DayStatsEntry(
                        s.getDate(),
                        s.getTotalIntakeMl(),
                        s.getGoalMl(),
                        s.getCompletionPercentage()))
                .collect(Collectors.toList());

        int weeklyTotal = statsList.stream().mapToInt(DailyStats::getTotalIntakeMl).sum();
        int average = statsList.isEmpty() ? 0 : weeklyTotal / statsList.size();

        return new WeeklyStatsResponse(days, weeklyTotal, average);
    }

}
