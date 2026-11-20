
package com.progresshub.steppie;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @GetMapping("/roadmaps")
    public List<SteppieRoadmapResponse> getUserRoadmaps(
            Authentication authentication) {

        String userEmail = authentication.getName();

        return roadmapService.getUserRoadmaps(userEmail)
                .stream()
                .map(roadmap -> new SteppieRoadmapResponse(
                        roadmap.getId(),
                        roadmap.getGoal(),
                        roadmap.getCreatedAt(),
                        roadmapService.getRoadmapSteps(
                                        userEmail,
                                        roadmap.getId()
                                ).stream()
                                .map(SteppieStepResponse::from)
                                .toList()
                ))
                .toList();
    }
}
