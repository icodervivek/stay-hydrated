package in.vivekpramanik.stay_hydrated_backend.mapper;

import in.vivekpramanik.stay_hydrated_backend.dto.profile.ProfileResponse;
import in.vivekpramanik.stay_hydrated_backend.entity.User;
import in.vivekpramanik.stay_hydrated_backend.entity.UserStreak;
import org.springframework.stereotype.Component;

@Component
public class ProfileMapper {

    public ProfileResponse toResponse(User user, long lifetimeTotalMl,
                                      UserStreak streak, int dailyGoalMl) {
        return new ProfileResponse(
                user.getName(),
                user.getEmail(),
                lifetimeTotalMl,
                streak != null ? streak.getCurrentStreak() : 0,
                streak != null ? streak.getLongestStreak() : 0,
                dailyGoalMl
        );
    }
}