
package com.progresshub.steppie;

import java.time.OffsetDateTime;
import java.util.List;

public record SteppieRoadmapResponse(
        Long id,
        String goal,
        OffsetDateTime createdAt,
        List<SteppieStepResponse> steps
) {
}
