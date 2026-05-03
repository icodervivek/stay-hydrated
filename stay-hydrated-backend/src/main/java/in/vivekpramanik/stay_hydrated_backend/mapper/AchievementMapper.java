package in.vivekpramanik.stay_hydrated_backend.mapper;

import in.vivekpramanik.stay_hydrated_backend.dto.achievement.AchievementResponse;
import in.vivekpramanik.stay_hydrated_backend.entity.Achievement;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Component
public class AchievementMapper {
    public AchievementResponse toResponse(Achievement achievement, Map<UUID, LocalDateTime> unlockedMap){
        boolean unlocked = unlockedMap.containsKey(achievement.getId());
        return new AchievementResponse(
                achievement.getId(),
                achievement.getTitle(),
                achievement.getDescription(),
                achievement.getConditionType(),
                achievement.getConditionValue(),
                unlocked,
                unlockedMap.get(achievement.getId())
        );
    }
}
