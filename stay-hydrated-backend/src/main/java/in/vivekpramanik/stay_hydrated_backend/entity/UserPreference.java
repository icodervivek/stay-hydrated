package in.vivekpramanik.stay_hydrated_backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name="user_preferences")
public class UserPreference {
    @Id
    private UUID userId;
    private boolean notificationsEnabled = true;
    private int reminderIntervalMinutes = 60;
    private int startHour = 8;
    private int endHour = 22;

    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;


}
