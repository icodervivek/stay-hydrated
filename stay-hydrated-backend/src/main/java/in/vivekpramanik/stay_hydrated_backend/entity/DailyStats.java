package in.vivekpramanik.stay_hydrated_backend.entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "daily_stats", uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "date"}))
@Data
public class DailyStats {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private LocalDate date;

    private int totalIntakeMl;

    private int goalMl;

    private int completionPercentage;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}