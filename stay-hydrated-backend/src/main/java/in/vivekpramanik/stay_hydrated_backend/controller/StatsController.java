package in.vivekpramanik.stay_hydrated_backend.controller;

import in.vivekpramanik.stay_hydrated_backend.dto.stats.TodayStatsResponse;
import in.vivekpramanik.stay_hydrated_backend.dto.stats.WeeklyStatsResponse;
import in.vivekpramanik.stay_hydrated_backend.service.StatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/stats")
@RequiredArgsConstructor
public class StatsController {

    @Autowired
    private final StatsService statsService;

    @GetMapping("/today")
    public ResponseEntity<TodayStatsResponse> getToday() {
        return ResponseEntity.ok(statsService.getToday());
    }

    @GetMapping("/weekly")
    public ResponseEntity<WeeklyStatsResponse> getWeekly() {
        return ResponseEntity.ok(statsService.getWeekly());
    }

}
