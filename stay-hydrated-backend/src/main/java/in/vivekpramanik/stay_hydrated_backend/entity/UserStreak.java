package in.vivekpramanik.stay_hydrated_backend.entity;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name="user_streaks")
@Data
public class UserStreak {
    @Id
    private UUID id;
    private int currentStreak;
    private int longestStreak;
    private LocalDate lastLoggedDate;

    @OneToOne
    @MapsId
    @JoinColumn(name="user_id")
    private User user;

}
