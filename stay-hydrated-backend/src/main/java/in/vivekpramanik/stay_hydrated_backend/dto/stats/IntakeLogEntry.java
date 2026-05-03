package in.vivekpramanik.stay_hydrated_backend.dto.stats;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
public class IntakeLogEntry {
    private UUID id;
    private int amountMl;
    private String imageUrl;
    private String aiLabel;
    private LocalDateTime loggedAt;
}
