package in.vivekpramanik.stay_hydrated_backend.mapper;
import in.vivekpramanik.stay_hydrated_backend.dto.intake.IntakeResponse;
import in.vivekpramanik.stay_hydrated_backend.entity.DailyStats;
import in.vivekpramanik.stay_hydrated_backend.entity.IntakeLog;
import org.springframework.stereotype.Component;

@Component
public class IntakeMapper {
    public IntakeResponse toResponse(IntakeLog log, DailyStats stats) {
        return new IntakeResponse(
                log.getId(),
                log.getAmountMl(),
                log.getImageUrl(),
                log.getAiLabel(),
                log.getCreatedAt(),
                stats.getTotalIntakeMl(),
                stats.getGoalMl(),
                stats.getCompletionPercentage()
        );
    }
}
