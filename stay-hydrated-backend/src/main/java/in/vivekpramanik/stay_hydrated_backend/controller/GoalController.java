package in.vivekpramanik.stay_hydrated_backend.controller;

import in.vivekpramanik.stay_hydrated_backend.dto.goal.GoalRequest;
import in.vivekpramanik.stay_hydrated_backend.dto.goal.GoalResponse;
import in.vivekpramanik.stay_hydrated_backend.service.GoalService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/goals")
@RequiredArgsConstructor
public class GoalController {
    @Autowired
    private final GoalService goalService;

    @PostMapping
    public ResponseEntity<GoalResponse> setGoal(@Valid @RequestBody GoalRequest goalRequest){
        return ResponseEntity.status(HttpStatus.CREATED).body(goalService.setGoal(goalRequest));
    }

    @GetMapping
    public ResponseEntity<GoalResponse> getAllGoals(){
        return ResponseEntity.ok(goalService.getLatestGoal());
    }
}
