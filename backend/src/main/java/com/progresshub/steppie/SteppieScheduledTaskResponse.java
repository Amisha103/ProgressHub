
package com.progresshub.steppie;

import java.time.LocalDate;
import java.time.OffsetDateTime;

public record SteppieScheduledTaskResponse(
        Long id,
        Long roadmapId,
        String roadmapGoal,
        Long stepId,
        Integer weekNumber,
        Integer stepOrder,
        String title,
        String description,
        Integer estimatedMinutes,
        LocalDate scheduledDate,
        String status,
        OffsetDateTime completedAt
) {

    public static SteppieScheduledTaskResponse from(
            SteppieScheduledTask task) {

        SteppieStep step = task.getStep();

        return new SteppieScheduledTaskResponse(
                task.getId(),
                task.getRoadmap().getId(),
                task.getRoadmap().getGoal(),
                step.getId(),
                step.getWeekNumber(),
                step.getStepOrder(),
                step.getTitle(),
                step.getDescription(),
                step.getEstimatedMinutes(),
                task.getScheduledDate(),
                task.getStatus().name(),
                task.getCompletedAt()
        );
    }
}
