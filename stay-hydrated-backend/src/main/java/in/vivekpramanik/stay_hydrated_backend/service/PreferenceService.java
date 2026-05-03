package in.vivekpramanik.stay_hydrated_backend.service;

import in.vivekpramanik.stay_hydrated_backend.dto.preference.PreferenceRequest;
import in.vivekpramanik.stay_hydrated_backend.dto.preference.PreferenceResponse;
import in.vivekpramanik.stay_hydrated_backend.entity.User;
import in.vivekpramanik.stay_hydrated_backend.entity.UserPreference;
import in.vivekpramanik.stay_hydrated_backend.exception.UserNotFoundException;
import in.vivekpramanik.stay_hydrated_backend.mapper.PreferenceMapper;
import in.vivekpramanik.stay_hydrated_backend.repository.UserPreferenceRepository;
import in.vivekpramanik.stay_hydrated_backend.repository.UserRepository;
import in.vivekpramanik.stay_hydrated_backend.util.SecurityUtils;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PreferenceService {

    private final UserPreferenceRepository userPreferenceRepository;
    private final UserRepository userRepository;
    private final PreferenceMapper preferenceMapper;

    public PreferenceResponse getPreferences() {
        UUID userId = SecurityUtils.getCurrentUserId();

        // returns entity defaults (true, 60, 8, 22) if not yet saved
        UserPreference pref = userPreferenceRepository.findById(userId)
                .orElseGet(UserPreference::new);

        return preferenceMapper.toResponse(pref);
    }

    @Transactional
    public PreferenceResponse savePreferences(PreferenceRequest request) {
        UUID userId = SecurityUtils.getCurrentUserId();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        UserPreference pref = userPreferenceRepository.findById(userId)
                .orElseGet(() -> {
                    UserPreference p = new UserPreference();
                    p.setUser(user);
                    return p;
                });

        pref.setNotificationsEnabled(request.getNotificationsEnabled());
        pref.setReminderIntervalMinutes(request.getReminderIntervalMinutes());
        pref.setStartHour(request.getStartHour());
        pref.setEndHour(request.getEndHour());

        return preferenceMapper.toResponse(userPreferenceRepository.save(pref));
    }
}