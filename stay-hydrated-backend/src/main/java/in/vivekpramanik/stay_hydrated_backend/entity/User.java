package in.vivekpramanik.stay_hydrated_backend.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name="users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy= GenerationType.UUID)
    private UUID id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String hashedPassword;

    @Column(name = "hashed_password", nullable = false)
    private String legacyHashedPassword;

    private String name;
    private LocalDateTime createdAt =  LocalDateTime.now();

    @PrePersist
    @PreUpdate
    private void syncPasswordColumns() {
        if (legacyHashedPassword == null) {
            legacyHashedPassword = hashedPassword;
        }
        if (hashedPassword == null) {
            hashedPassword = legacyHashedPassword;
        }
    }

    // Relationships
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<IntakeLog> intakeLogs;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<UserGoal> goals;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private UserStreak streak;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private UserPreference preference;

}
