
package com.progresshub.steppie;

public record SteppieStepUpdateRequest(
        Integer weekNumber,
        Integer stepOrder,
        String title,
        String description,
        Integer estimatedMinutes
) {}
