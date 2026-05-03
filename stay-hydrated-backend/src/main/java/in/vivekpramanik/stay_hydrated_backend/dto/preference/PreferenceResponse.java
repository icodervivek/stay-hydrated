package in.vivekpramanik.stay_hydrated_backend.dto.preference;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PreferenceResponse {
    private boolean notificationsEnabled;
    private int reminderIntervalMinutes;
    private int startHour;
    private int endHour;

}
