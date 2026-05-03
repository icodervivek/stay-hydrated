package in.vivekpramanik.stay_hydrated_backend.dto.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RefreshRequest {
    @NotBlank(message = "Refresh token is required")
    private String refreshToken;
}
