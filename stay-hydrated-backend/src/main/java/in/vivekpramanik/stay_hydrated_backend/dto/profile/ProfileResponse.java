package in.vivekpramanik.stay_hydrated_backend.dto.profile;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ProfileResponse {
    private String name;
    private String email;
    private long lifetimeTotalMl;
    private int currentStreak;
    private int longestStreak;
    private int dailyGoalMl;
}