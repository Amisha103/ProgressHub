
package com.progresshub.steppie;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface SteppieScheduledTaskRepository
        extends JpaRepository<SteppieScheduledTask, Long> {

    @EntityGraph(attributePaths = {"roadmap", "step"})
    List<SteppieScheduledTask>
    findAllByUserIdAndScheduledDateOrderByIdAsc(
            Long userId,
            LocalDate scheduledDate
    );

    @EntityGraph(attributePaths = {"roadmap", "step"})
    List<SteppieScheduledTask>
    findAllByUserIdAndScheduledDateBetweenOrderByScheduledDateAscIdAsc(
            Long userId,
            LocalDate startDate,
            LocalDate endDate
    );

    @EntityGraph(attributePaths = {"roadmap", "step"})
    List<SteppieScheduledTask>
    findAllByRoadmapIdAndUserIdOrderByScheduledDateAsc(
            Long roadmapId,
            Long userId
    );

    @EntityGraph(attributePaths = {"roadmap", "step"})
    Optional<SteppieScheduledTask> findByIdAndUserId(
            Long id,
            Long userId
    );

    boolean existsByRoadmapIdAndUserId(
            Long roadmapId,
            Long userId
    );
}
