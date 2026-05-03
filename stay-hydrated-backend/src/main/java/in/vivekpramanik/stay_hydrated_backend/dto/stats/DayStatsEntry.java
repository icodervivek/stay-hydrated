package in.vivekpramanik.stay_hydrated_backend.dto.stats;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;

@Data
@AllArgsConstructor
public class DayStatsEntry {
    private LocalDate date;
    private int totalIntakeMl;
    private int goalMl;
    private int completionPercentage;
}
