package in.vivekpramanik.stay_hydrated_backend.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class DashboardResponse {
    private String name;
    private int todayTotalML;
    private int goalMl;
    private int completionPercentage;
    private int currentStreak;
    private int longestStreak;
    private List<RecentLogEntry> recentLogs;
}
