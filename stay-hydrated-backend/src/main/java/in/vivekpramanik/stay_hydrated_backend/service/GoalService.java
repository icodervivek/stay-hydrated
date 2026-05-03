package in.vivekpramanik.stay_hydrated_backend.service;

import in.vivekpramanik.stay_hydrated_backend.dto.goal.GoalRequest;
import in.vivekpramanik.stay_hydrated_backend.dto.goal.GoalResponse;
import in.vivekpramanik.stay_hydrated_backend.entity.User;
import in.vivekpramanik.stay_hydrated_backend.entity.UserGoal;
import in.vivekpramanik.stay_hydrated_backend.exception.ResourceNotFoundException;
import in.vivekpramanik.stay_hydrated_backend.exception.UserNotFoundException;
import in.vivekpramanik.stay_hydrated_backend.mapper.GoalMapper;
import in.vivekpramanik.stay_hydrated_backend.repository.UserGoalRepository;
import in.vivekpramanik.stay_hydrated_backend.repository.UserRepository;
import in.vivekpramanik.stay_hydrated_backend.util.SecurityUtils;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class GoalService {
    @Autowired
    private final UserGoalRepository userGoalRepository;
    @Autowired
    private final UserRepository userRepository;
    @Autowired
    private final GoalMapper goalMapper;

    @Transactional
    public GoalResponse setGoal(GoalRequest request) {
        UUID userId = SecurityUtils.getCurrentUserId();
        User user = userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException("User not found!"));
        UserGoal goal = new UserGoal();
        goal.setUser(user);
        goal.setDailyGoal(request.getDailyGoalMl());

        return goalMapper.toResponse(userGoalRepository.save(goal));
    }

    public GoalResponse getLatestGoal() {
        UUID userId = SecurityUtils.getCurrentUserId();

        UserGoal goal = userGoalRepository.findLatestGoal(userId)
                .orElseThrow(() -> new ResourceNotFoundException("No goal set yet"));

        return goalMapper.toResponse(goal);

    }
}
