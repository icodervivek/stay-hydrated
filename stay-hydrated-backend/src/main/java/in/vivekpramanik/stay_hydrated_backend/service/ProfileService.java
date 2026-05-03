package in.vivekpramanik.stay_hydrated_backend.service;

import in.vivekpramanik.stay_hydrated_backend.dto.profile.ProfileResponse;
import in.vivekpramanik.stay_hydrated_backend.dto.profile.UpdateProfileRequest;
import in.vivekpramanik.stay_hydrated_backend.entity.User;
import in.vivekpramanik.stay_hydrated_backend.entity.UserGoal;
import in.vivekpramanik.stay_hydrated_backend.entity.UserStreak;
import in.vivekpramanik.stay_hydrated_backend.exception.InvalidCredentialsException;
import in.vivekpramanik.stay_hydrated_backend.exception.UserNotFoundException;
import in.vivekpramanik.stay_hydrated_backend.mapper.ProfileMapper;
import in.vivekpramanik.stay_hydrated_backend.repository.*;
import in.vivekpramanik.stay_hydrated_backend.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final UserRepository userRepository;
    private final UserStreakRepository userStreakRepository;
    private final UserGoalRepository userGoalRepository;
    private final IntakeLogRepository intakeLogRepository;
    private final PasswordEncoder passwordEncoder;
    private final ProfileMapper profileMapper;

    public ProfileResponse getProfile() {
        UUID userId = SecurityUtils.getCurrentUserId();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        long lifetimeTotal = intakeLogRepository.getLifetimeTotal(userId);
        UserStreak streak = userStreakRepository.findById(userId).orElse(null);
        int dailyGoalMl = userGoalRepository.findLatestGoal(userId)
                .map(UserGoal::getDailyGoal)
                .orElse(2000);

        return profileMapper.toResponse(user, lifetimeTotal, streak, dailyGoalMl);
    }

    @Transactional
    public ProfileResponse updateProfile(UpdateProfileRequest request) {
        UUID userId = SecurityUtils.getCurrentUserId();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        user.setName(request.getName());

        if (request.getNewPassword() != null && !request.getNewPassword().isBlank()) {
            if (request.getCurrentPassword() == null ||
                    !passwordEncoder.matches(request.getCurrentPassword(), user.getHashedPassword())) {
                throw new InvalidCredentialsException("Current password is incorrect");
            }
            user.setHashedPassword(passwordEncoder.encode(request.getNewPassword()));
        }

        User saved = userRepository.save(user);

        long lifetimeTotal = intakeLogRepository.getLifetimeTotal(userId);
        UserStreak streak = userStreakRepository.findById(userId).orElse(null);
        int dailyGoalMl = userGoalRepository.findLatestGoal(userId)
                .map(UserGoal::getDailyGoal)
                .orElse(2000);

        return profileMapper.toResponse(saved, lifetimeTotal, streak, dailyGoalMl);
    }
}