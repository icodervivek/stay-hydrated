package in.vivekpramanik.stay_hydrated_backend.repository;

import in.vivekpramanik.stay_hydrated_backend.entity.UserPreference;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface UserPreferenceRepository extends JpaRepository<UserPreference, UUID> {

}
