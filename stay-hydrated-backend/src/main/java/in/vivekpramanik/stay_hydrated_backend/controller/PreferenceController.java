package in.vivekpramanik.stay_hydrated_backend.controller;

import in.vivekpramanik.stay_hydrated_backend.dto.preference.PreferenceRequest;
import in.vivekpramanik.stay_hydrated_backend.dto.preference.PreferenceResponse;
import in.vivekpramanik.stay_hydrated_backend.service.PreferenceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/preferences")
@RequiredArgsConstructor
public class PreferenceController {
    @Autowired
    private final PreferenceService preferenceService;

    @GetMapping
    public ResponseEntity<PreferenceResponse> getPreferences() {
        return ResponseEntity.ok(preferenceService.getPreferences());
    }

    @PostMapping
    public ResponseEntity<PreferenceResponse> savePreferences(@Valid @RequestBody PreferenceRequest request) {
        return ResponseEntity.ok(preferenceService.savePreferences(request));
    }


}
