package in.vivekpramanik.stay_hydrated_backend.service;

import in.vivekpramanik.stay_hydrated_backend.dto.achievement.AchievementResponse;
import in.vivekpramanik.stay_hydrated_backend.entity.Achievement;
import in.vivekpramanik.stay_hydrated_backend.entity.UserAchievement;
import in.vivekpramanik.stay_hydrated_backend.mapper.AchievementMapper;
import in.vivekpramanik.stay_hydrated_backend.repository.AchievementRepository;
import in.vivekpramanik.stay_hydrated_backend.repository.UserAchievementRepository;
import in.vivekpramanik.stay_hydrated_backend.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AchievementService {
    @Autowired
    private final AchievementRepository achievementRepository;
    @Autowired
    private final UserAchievementRepository userAchievementRepository;
    @Autowired
    private final AchievementMapper achievementMapper;

    public List<AchievementResponse> getAchievements(){
        UUID userId = SecurityUtils.getCurrentUserId();

        List<Achievement> all = achievementRepository.findAll();
        Map<UUID, LocalDateTime> unlockedMap = userAchievementRepository.findByUserId(userId)
                .stream()
                .collect(Collectors.toMap(
                        ua -> ua.getAchievement().getId(),
                        UserAchievement::getUnlockedAt
                ));

                return all.stream()
                        .map(a-> achievementMapper.toResponse(a, unlockedMap))
                        .collect(Collectors.toList());
    }
}
