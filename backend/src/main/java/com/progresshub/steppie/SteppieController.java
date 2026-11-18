
package com.progresshub.steppie;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/steppie")
public class SteppieController {

    private final SteppieRoadmapService roadmapService;

    public SteppieController(SteppieRoadmapService roadmapService) {
        this.roadmapService = roadmapService;
    }

    @PostMapping("/roadmaps/generate")
    public SteppieRoadmapResponse generateRoadmap(
            @RequestBody SteppieGoalRequest request,
            Authentication authentication) {

        return roadmapService.generateAndSaveRoadmap(
                authentication.getName(),
                request.getGoal()
        );
    }
}
