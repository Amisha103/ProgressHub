
package com.progresshub.steppie;

public record SteppieStepCreateRequest(
        Integer weekNumber,
        String title,
        String description,
        Integer estimatedMinutes
) {}
