package in.vivekpramanik.stay_hydrated_backend.dto.stats;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class WeeklyStatsResponse {
    private List<DayStatsEntry> days;
    private int weeklyTotalMl;
    private int averageDailyMl;
}
