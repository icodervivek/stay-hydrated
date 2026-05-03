package in.vivekpramanik.stay_hydrated_backend.repository;

import in.vivekpramanik.stay_hydrated_backend.entity.DailyStats;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.Optional;


@Repository
public interface DailyStatsRepository extends JpaRepository<DailyStats, UUID> {
    Optional<DailyStats> findByUserIdAndDate(UUID userId, LocalDate date);
    List<DailyStats> findTop7ByUserIdOrderByDateDesc(UUID userId);

}
