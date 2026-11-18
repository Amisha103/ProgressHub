
package com.progresshub.steppie;

import com.progresshub.common.exception.ResourceNotFoundException;
import com.progresshub.user.User;
import com.progresshub.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SteppieRoadmapService {

    private final SteppieRoadmapRepository roadmapRepository;
    private final SteppieStepRepository stepRepository;
    private final UserRepository userRepository;
    private final SteppieAiService steppieAiService;
    public SteppieRoadmapService(
            SteppieRoadmapRepository roadmapRepository,
            SteppieStepRepository stepRepository,
            UserRepository userRepository,
            SteppieAiService steppieAiService) {

        this.roadmapRepository = roadmapRepository;
        this.stepRepository = stepRepository;
        this.userRepository = userRepository;
        this.steppieAiService = steppieAiService;
    }

    @Transactional
    public SteppieRoadmap saveRoadmap(
            String userEmail,
            String goal,
            List<SteppieStep> steps) {

        if (goal == null || goal.isBlank()) {
            throw new IllegalArgumentException(
                    "Goal cannot be empty");
        }

        if (steps == null || steps.isEmpty()) {
            throw new IllegalArgumentException(
                    "Roadmap must contain at least one step");
        }

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        SteppieRoadmap roadmap = new SteppieRoadmap();
        roadmap.setUser(user);
        roadmap.setGoal(goal.trim());

        SteppieRoadmap savedRoadmap =
                roadmapRepository.save(roadmap);

        for (SteppieStep step : steps) {
            step.setRoadmap(savedRoadmap);
        }

        stepRepository.saveAll(steps);

        return savedRoadmap;
    }

    @Transactional(readOnly = true)
    public List<SteppieRoadmap> getUserRoadmaps(
            String userEmail) {

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        return roadmapRepository
                .findAllByUserIdOrderByCreatedAtDesc(user.getId());
    }

    @Transactional(readOnly = true)
    public List<SteppieStep> getRoadmapSteps(
            String userEmail,
            Long roadmapId) {

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        roadmapRepository.findByIdAndUserId(
                roadmapId, user.getId()
        ).orElseThrow(() ->
                new ResourceNotFoundException("Roadmap not found"));

        return stepRepository
                .findAllByRoadmapIdOrderByWeekNumberAscStepOrderAsc(
                        roadmapId);
    }


    @Transactional
    public SteppieRoadmapResponse generateAndSaveRoadmap(
            String userEmail,
            String goal) {

        if (goal == null || goal.isBlank()) {
            throw new IllegalArgumentException("Goal cannot be empty");
        }

        List<SteppieStep> steps =
                steppieAiService.generateRoadmap(goal.trim());

        SteppieRoadmap roadmap =
                saveRoadmap(userEmail, goal, steps);

        List<SteppieStepResponse> stepResponses =
                getRoadmapSteps(userEmail, roadmap.getId())
                        .stream()
                        .map(SteppieStepResponse::from)
                        .toList();

        return new SteppieRoadmapResponse(
                roadmap.getId(),
                roadmap.getGoal(),
                roadmap.getCreatedAt(),
                stepResponses
        );
    }

}
