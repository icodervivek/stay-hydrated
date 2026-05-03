package in.vivekpramanik.stay_hydrated_backend.repository;

import in.vivekpramanik.stay_hydrated_backend.entity.IntakeLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface IntakeLogRepository extends JpaRepository<IntakeLog, UUID> {

    @Query("SELECT SUM(i.amountMl) FROM IntakeLog i WHERE i.user.id = :userId AND DATE(i.createdAt) = CURRENT_DATE")
    Integer getTodayTotal(UUID userId);

    @Query("SELECT COALESCE(SUM(i.amountMl), 0) FROM IntakeLog i WHERE i.user.id = :userId")
    long getLifetimeTotal(UUID userId);

    List<IntakeLog> findByUserIdOrderByCreatedAtDesc(UUID userId);

    Page<IntakeLog> findByUserIdOrderByCreatedAtDesc(UUID userId, Pageable pageable);

}
