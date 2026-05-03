package in.vivekpramanik.stay_hydrated_backend.controller;


import in.vivekpramanik.stay_hydrated_backend.dto.intake.IntakeRequest;
import in.vivekpramanik.stay_hydrated_backend.dto.intake.IntakeResponse;
import in.vivekpramanik.stay_hydrated_backend.dto.stats.IntakeLogEntry;
import in.vivekpramanik.stay_hydrated_backend.service.IntakeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/intake")
@RequiredArgsConstructor
public class IntakeController {
    private final IntakeService intakeService;

    @PostMapping
    public ResponseEntity<IntakeResponse> addIntake(@Valid @RequestBody IntakeRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(intakeService.addIntake(request));
    }

    @GetMapping("/history")
    public ResponseEntity<Page<IntakeLogEntry>> getHistory(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(intakeService.getHistory(page, size));
    }
}
