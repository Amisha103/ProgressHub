
package com.progresshub.steppie;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/steppie")
public class SteppieController {

    private final SteppieRoadmapService roadmapService;
    private final SteppieStepService stepService;

    public SteppieController(
            SteppieRoadmapService roadmapService,
            SteppieStepService stepService) {

        this.roadmapService = roadmapService;
        this.stepService = stepService;
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

    @PutMapping("/roadmaps/{roadmapId}/steps/{stepId}")
    public SteppieStepResponse updateStep(
            @PathVariable Long roadmapId,
            @PathVariable Long stepId,
            @RequestBody SteppieStepUpdateRequest request,
            Authentication authentication) {

        return stepService.updateStep(
                authentication.getName(),
                roadmapId,
                stepId,
                request
        );
    }

    @PostMapping("/roadmaps/{roadmapId}/steps")
    public SteppieStepResponse createStep(
            @PathVariable Long roadmapId,
            @RequestBody SteppieStepCreateRequest request,
            Authentication authentication) {

        return stepService.createStep(
                authentication.getName(),
                roadmapId,
                request
        );
    }


    @DeleteMapping("/roadmaps/{roadmapId}/steps/{stepId}")
    public void deleteStep(
            @PathVariable Long roadmapId,
            @PathVariable Long stepId,
            Authentication authentication) {

        stepService.deleteStep(
                authentication.getName(),
                roadmapId,
                stepId
        );
    }

}
