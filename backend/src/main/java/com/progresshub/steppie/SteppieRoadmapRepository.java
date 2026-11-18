
package com.progresshub.steppie;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SteppieRoadmapRepository
        extends JpaRepository<SteppieRoadmap, Long> {

    List<SteppieRoadmap> findAllByUserIdOrderByCreatedAtDesc(
            Long userId
    );

    Optional<SteppieRoadmap> findByIdAndUserId(
            Long id,
            Long userId
    );
}
