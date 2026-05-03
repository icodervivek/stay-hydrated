package in.vivekpramanik.stay_hydrated_backend.repository;

import in.vivekpramanik.stay_hydrated_backend.entity.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, UUID> {
    Optional<RefreshToken> findByToken(String token);

    void deleteByToken(String token);

    void deleteByUserId(UUID userId);
}
