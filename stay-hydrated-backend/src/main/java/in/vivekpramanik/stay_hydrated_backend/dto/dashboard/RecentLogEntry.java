package in.vivekpramanik.stay_hydrated_backend.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
public class RecentLogEntry {
    private UUID id;
    private int amountMl;
    private String aiLabel;
    private LocalDateTime loggedAt;
}
