package in.vivekpramanik.stay_hydrated_backend.mapper;

import in.vivekpramanik.stay_hydrated_backend.dto.auth.AuthResponse;
import in.vivekpramanik.stay_hydrated_backend.entity.User;
import org.springframework.stereotype.Component;

@Component
public class AuthMapper {
    public AuthResponse toAuthResponse(User user, String accessToken, String refreshToken) {
        return new AuthResponse(accessToken, refreshToken, user.getName(), user.getEmail());
    }
}
