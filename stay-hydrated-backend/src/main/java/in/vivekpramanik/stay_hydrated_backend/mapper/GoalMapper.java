package in.vivekpramanik.stay_hydrated_backend.mapper;

import in.vivekpramanik.stay_hydrated_backend.dto.goal.GoalResponse;
import in.vivekpramanik.stay_hydrated_backend.entity.UserGoal;
import org.springframework.stereotype.Component;

@Component
public class GoalMapper {
    public GoalResponse toResponse(UserGoal goal){
        return new GoalResponse(
                goal.getId(),
                goal.getDailyGoal(),
                goal.getCreatedAt()
        );
    }
}
