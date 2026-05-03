package in.vivekpramanik.stay_hydrated_backend.dto.preference;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PreferenceRequest {
    @NotNull(message = "notificationsEnabled is required")
    private Boolean notificationsEnabled;

    @NotNull(message = "reminderIntervalMinutes is required")
    @Min(value = 15, message = "Reminder interval must be at least 15 minutes")
    @Max(value = 1440, message = "Reminder interval cannot exceed 1440 minutes")
    private Integer reminderIntervalMinutes;

    @NotNull(message = "startHour is required")
    @Min(value = 0, message = "startHour must be between 0 and 23")
    @Max(value = 23, message = "startHour must be between 0 and 23")
    private Integer startHour;

    @NotNull(message = "endHour is required")
    @Min(value = 0, message = "endHour must be between 0 and 23")
    @Max(value = 23, message = "endHour must be between 0 and 23")
    private Integer endHour;



}
