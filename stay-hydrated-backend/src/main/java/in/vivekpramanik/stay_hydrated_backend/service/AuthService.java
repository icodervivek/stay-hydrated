package in.vivekpramanik.stay_hydrated_backend.service;

import in.vivekpramanik.stay_hydrated_backend.dto.auth.AuthResponse;
import in.vivekpramanik.stay_hydrated_backend.dto.auth.LoginRequest;
import in.vivekpramanik.stay_hydrated_backend.dto.auth.RefreshRequest;
import in.vivekpramanik.stay_hydrated_backend.dto.auth.RegisterRequest;
import in.vivekpramanik.stay_hydrated_backend.entity.RefreshToken;
import in.vivekpramanik.stay_hydrated_backend.entity.User;
import in.vivekpramanik.stay_hydrated_backend.exception.InvalidCredentialsException;
import in.vivekpramanik.stay_hydrated_backend.exception.ResourceNotFoundException;
import in.vivekpramanik.stay_hydrated_backend.mapper.AuthMapper;
import in.vivekpramanik.stay_hydrated_backend.repository.RefreshTokenRepository;
import in.vivekpramanik.stay_hydrated_backend.repository.UserRepository;
import in.vivekpramanik.stay_hydrated_backend.security.JwtUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {
    @Autowired
    private final UserRepository userRepository;
    @Autowired
    private final RefreshTokenRepository refreshTokenRepository;
    @Autowired
    private final PasswordEncoder passwordEncoder;
    @Autowired
    private final JwtUtil jwtUtil;
    @Autowired
    private final AuthMapper authMapper;

    @Value("${app.jwt.refresh-token-expiry-days}")
    private int refreshTokenExpiryDays;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new InvalidCredentialsException("Email already registered");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setName(request.getName());
        user.setHashedPassword(passwordEncoder.encode(request.getPassword()));

        User saved = userRepository.save(user);
        return generateAuthResponse(saved);
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getHashedPassword())) {
            throw new InvalidCredentialsException("Invalid email or password");
        }

        return generateAuthResponse(user);
    }

    @Transactional
    public AuthResponse refresh(RefreshRequest request) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(request.getRefreshToken())
                .orElseThrow(() -> new ResourceNotFoundException("Refresh token not found"));

        if (refreshToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            refreshTokenRepository.delete(refreshToken);
            throw new InvalidCredentialsException("Refresh token expired, please login again");
        }

        User user = refreshToken.getUser();
        String newAccessToken = jwtUtil.generateAccessToken(user.getId(), user.getEmail());

        return authMapper.toAuthResponse(user, newAccessToken, request.getRefreshToken());
    }

    @Transactional
    public void logout(String refreshTokenValue) {
        refreshTokenRepository.findByToken(refreshTokenValue)
                .ifPresent(refreshTokenRepository::delete);
    }


    private AuthResponse generateAuthResponse(User user) {
        String accessToken = jwtUtil.generateAccessToken(user.getId(), user.getEmail());
        String rawRefreshToken = UUID.randomUUID().toString();

        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setToken(rawRefreshToken);
        refreshToken.setUser(user);
        refreshToken.setExpiresAt(LocalDateTime.now().plusDays(refreshTokenExpiryDays));
        refreshTokenRepository.save(refreshToken);

        return authMapper.toAuthResponse(user, accessToken, rawRefreshToken);
    }


}
