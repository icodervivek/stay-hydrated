package in.vivekpramanik.stay_hydrated_backend.dto.stats;

import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class TodayStatsResponse {
    private LocalDate date;
    private int totalIntakeMl;
    private int goalMl;
    private int completionPercentage;
    private List<IntakeLogEntry> logs;

    public TodayStatsResponse(LocalDate date, int totalIntakeMl, int goalMl, int completionPercentage, List<IntakeLogEntry> entries) {
        this.date = date;
        this.totalIntakeMl = totalIntakeMl;
        this.goalMl = goalMl;
        this.completionPercentage = completionPercentage;
        this.logs = entries;
    }
}
