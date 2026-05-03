package in.vivekpramanik.stay_hydrated_backend.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "intake_logs")
@Data
public class IntakeLog {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    private int amountMl;
    private String imageUrl;
    private String aiLabel;
    private LocalDateTime createdAt = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name="user_id")
    private User user;
}
