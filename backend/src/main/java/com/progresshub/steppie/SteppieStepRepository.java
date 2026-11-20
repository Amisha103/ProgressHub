
package com.progresshub.steppie;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SteppieStepRepository
        extends JpaRepository<SteppieStep, Long> {

    List<SteppieStep> findAllByRoadmapIdOrderByWeekNumberAscStepOrderAsc(
            Long roadmapId
    );

    List<SteppieStep> findAllByRoadmapIdAndWeekNumberOrderByStepOrderAsc(
            Long roadmapId,
            Integer weekNumber
    );

    Optional<SteppieStep> findByIdAndRoadmapId(
            Long id,
            Long roadmapId
    );

    void deleteAllByRoadmapId(Long roadmapId);
}
