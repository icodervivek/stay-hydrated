package in.vivekpramanik.stay_hydrated_backend.dto.intake;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
public class IntakeResponse {
    private UUID logId;
    private int amountMl;
    private String imageUrl;
    private String aiLabel;
    private LocalDateTime loggedAt;
    private int todayTotalMl;
    private int goalMl;
    private int completionPercentage;
}
