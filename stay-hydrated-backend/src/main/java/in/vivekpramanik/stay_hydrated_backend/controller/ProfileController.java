package in.vivekpramanik.stay_hydrated_backend.controller;

import in.vivekpramanik.stay_hydrated_backend.dto.profile.ProfileResponse;
import in.vivekpramanik.stay_hydrated_backend.dto.profile.UpdateProfileRequest;
import in.vivekpramanik.stay_hydrated_backend.service.ProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    @GetMapping
    public ResponseEntity<ProfileResponse> getProfile() {
        return ResponseEntity.ok(profileService.getProfile());
    }

    @PutMapping
    public ResponseEntity<ProfileResponse> updateProfile(@Valid @RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok(profileService.updateProfile(request));
    }
}