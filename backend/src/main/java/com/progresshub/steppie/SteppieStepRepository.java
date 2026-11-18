
package com.progresshub.steppie;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SteppieStepRepository
        extends JpaRepository<SteppieStep, Long> {

    List<SteppieStep> findAllByRoadmapIdOrderByWeekNumberAscStepOrderAsc(
            Long roadmapId
    );

    void deleteAllByRoadmapId(Long roadmapId);
}
