package in.vivekpramanik.stay_hydrated_backend.dto.goal;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class GoalRequest {
    @NotNull(message = "Daily goal is required")
    @Min(value = 1, message="Daily goal must be at least 1 ml")
    private Integer dailyGoalMl;
}
