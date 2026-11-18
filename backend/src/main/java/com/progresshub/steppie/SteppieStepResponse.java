
package com.progresshub.steppie;

public record SteppieStepResponse(
        Long id,
        Integer weekNumber,
        Integer stepOrder,
        String title,
        String description,
        Integer estimatedMinutes
) {
    public static SteppieStepResponse from(SteppieStep step) {
        return new SteppieStepResponse(
                step.getId(),
                step.getWeekNumber(),
                step.getStepOrder(),
                step.getTitle(),
                step.getDescription(),
                step.getEstimatedMinutes()
        );
    }
}
