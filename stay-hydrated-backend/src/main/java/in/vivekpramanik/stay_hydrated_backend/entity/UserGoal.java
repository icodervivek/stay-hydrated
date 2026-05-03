package in.vivekpramanik.stay_hydrated_backend.entity;


import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name="user_goals")
@Data
public class UserGoal {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "daily_goal_ml", nullable = false)
    private int dailyGoal;

    @Column(name = "daily_goal", nullable = false)
    private Integer legacyDailyGoal;

    private LocalDateTime createdAt = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @PrePersist
    @PreUpdate
    private void syncGoalColumns() {
        if (legacyDailyGoal == null) {
            legacyDailyGoal = dailyGoal;
        }
    }

}
