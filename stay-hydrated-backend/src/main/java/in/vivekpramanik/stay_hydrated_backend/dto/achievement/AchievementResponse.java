package in.vivekpramanik.stay_hydrated_backend.dto.achievement;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
public class AchievementResponse {
    private UUID id;
    private String title;
    private String description;
    private String conditionType;
    private int conditionValue;
    private boolean unlocked;
    private LocalDateTime unlockedAt;
}
