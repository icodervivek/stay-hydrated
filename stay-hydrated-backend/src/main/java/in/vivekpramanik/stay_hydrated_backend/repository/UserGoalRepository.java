package in.vivekpramanik.stay_hydrated_backend.repository;

import in.vivekpramanik.stay_hydrated_backend.entity.UserGoal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.UUID;
import java.util.Optional;

public interface UserGoalRepository extends JpaRepository<UserGoal, UUID> {
    @Query("SELECT g FROM UserGoal g WHERE g.user.id = :userId ORDER BY g.createdAt DESC LIMIT 1")
    Optional<UserGoal> findLatestGoal(UUID userId);
}
