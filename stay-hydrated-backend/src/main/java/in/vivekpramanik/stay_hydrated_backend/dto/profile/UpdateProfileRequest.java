package in.vivekpramanik.stay_hydrated_backend.dto.profile;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateProfileRequest {

    @NotBlank(message = "Name is required")
    private String name;

    private String currentPassword;

    @Size(min = 8, message = "New password must be at least 8 characters")
    private String newPassword;
}