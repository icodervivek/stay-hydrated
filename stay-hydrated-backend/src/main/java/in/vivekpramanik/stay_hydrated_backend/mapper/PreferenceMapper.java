package in.vivekpramanik.stay_hydrated_backend.mapper;

import in.vivekpramanik.stay_hydrated_backend.dto.preference.PreferenceResponse;
import in.vivekpramanik.stay_hydrated_backend.entity.UserPreference;
import org.springframework.stereotype.Component;

@Component
public class PreferenceMapper {
    public PreferenceResponse toResponse(UserPreference pref) {
        return new PreferenceResponse(
                pref.isNotificationsEnabled(),
                pref.getReminderIntervalMinutes(),
                pref.getStartHour(),
                pref.getEndHour()
        );
    }

}
