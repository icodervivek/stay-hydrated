package in.vivekpramanik.stay_hydrated_backend.controller;

import in.vivekpramanik.stay_hydrated_backend.dto.achievement.AchievementResponse;
import in.vivekpramanik.stay_hydrated_backend.entity.Achievement;
import in.vivekpramanik.stay_hydrated_backend.service.AchievementService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/achievements")
@RequiredArgsConstructor
public class AchievementController {
    @Autowired
    private final AchievementService achievementService;

    @GetMapping
    public ResponseEntity<List<AchievementResponse>> getAchievements() {
        return ResponseEntity.ok(achievementService.getAchievements());
    }
}
