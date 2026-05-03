package in.vivekpramanik.stay_hydrated_backend.dto.goal;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
public class GoalResponse {
    private UUID id;
    private int dailyGoalMl;
    private LocalDateTime createdAt;
}
