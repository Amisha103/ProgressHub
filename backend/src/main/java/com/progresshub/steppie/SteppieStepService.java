
package com.progresshub.steppie;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.progresshub.user.UserRepository;
import java.util.List;

@Service
public class SteppieStepService {

    private final SteppieStepRepository stepRepository;
    private final SteppieRoadmapRepository roadmapRepository;
    private final UserRepository userRepository;

    public SteppieStepService(
            SteppieStepRepository stepRepository,
            SteppieRoadmapRepository roadmapRepository,
            UserRepository userRepository) {
        this.stepRepository = stepRepository;
        this.roadmapRepository = roadmapRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public SteppieStepResponse updateStep(
            String userEmail,
            Long roadmapId,
            Long stepId,
            SteppieStepUpdateRequest request) {

        var user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        roadmapRepository.findByIdAndUserId(roadmapId, user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Roadmap not found"));

        SteppieStep step = stepRepository.findByIdAndRoadmapId(stepId, roadmapId)
                .orElseThrow(() -> new IllegalArgumentException("Step not found"));

        if (request == null
                || request.weekNumber() == null || request.weekNumber() < 1
                || request.stepOrder() == null || request.stepOrder() < 1
                || request.title() == null || request.title().isBlank()
                || request.title().length() > 300
                || request.description() == null || request.description().isBlank()
                || request.description().length() > 2000
                || request.estimatedMinutes() == null
                || request.estimatedMinutes() < 1) {
            throw new IllegalArgumentException("Invalid step details");
        }

        Integer oldWeek = step.getWeekNumber();
        Integer newWeek = request.weekNumber();

        List<SteppieStep> oldWeekSteps =
                stepRepository.findAllByRoadmapIdAndWeekNumberOrderByStepOrderAsc(
                        roadmapId, oldWeek);

        oldWeekSteps.removeIf(existing -> existing.getId().equals(stepId));

        List<SteppieStep> newWeekSteps;

        if (oldWeek.equals(newWeek)) {
            newWeekSteps = oldWeekSteps;
        } else {
            newWeekSteps =
                    stepRepository.findAllByRoadmapIdAndWeekNumberOrderByStepOrderAsc(
                            roadmapId, newWeek);
        }

        int insertionIndex = Math.min(
                request.stepOrder() - 1,
                newWeekSteps.size()
        );

        newWeekSteps.add(insertionIndex, step);

        step.setWeekNumber(newWeek);
        step.setTitle(request.title().trim());
        step.setDescription(request.description().trim());
        step.setEstimatedMinutes(request.estimatedMinutes());

        if (!oldWeek.equals(newWeek)) {
            renumber(oldWeekSteps);
        }

        renumber(newWeekSteps);

        stepRepository.saveAll(oldWeekSteps);
        stepRepository.saveAll(newWeekSteps);

        return SteppieStepResponse.from(step);
    }

    @Transactional
    public SteppieStepResponse createStep(
            String userEmail,
            Long roadmapId,
            SteppieStepCreateRequest request) {

        var user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        var roadmap = roadmapRepository.findByIdAndUserId(roadmapId, user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Roadmap not found"));

        if (request == null
                || request.weekNumber() == null || request.weekNumber() < 1
                || request.title() == null || request.title().isBlank()
                || request.title().length() > 300
                || request.description() == null || request.description().isBlank()
                || request.description().length() > 2000
                || request.estimatedMinutes() == null
                || request.estimatedMinutes() < 1) {
            throw new IllegalArgumentException("Invalid step details");
        }

        List<SteppieStep> existingSteps =
                stepRepository.findAllByRoadmapIdAndWeekNumberOrderByStepOrderAsc(
                        roadmapId, request.weekNumber());

        SteppieStep step = new SteppieStep();
        step.setRoadmap(roadmap);
        step.setWeekNumber(request.weekNumber());
        step.setStepOrder(existingSteps.size() + 1);
        step.setTitle(request.title().trim());
        step.setDescription(request.description().trim());
        step.setEstimatedMinutes(request.estimatedMinutes());

        return SteppieStepResponse.from(stepRepository.save(step));
    }

    @Transactional
    public void deleteStep(
            String userEmail,
            Long roadmapId,
            Long stepId) {

        var user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        roadmapRepository.findByIdAndUserId(roadmapId, user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Roadmap not found"));

        SteppieStep step = stepRepository.findByIdAndRoadmapId(stepId, roadmapId)
                .orElseThrow(() -> new IllegalArgumentException("Step not found"));

        Integer weekNumber = step.getWeekNumber();

        stepRepository.delete(step);
        stepRepository.flush();

        List<SteppieStep> remainingSteps =
                stepRepository.findAllByRoadmapIdAndWeekNumberOrderByStepOrderAsc(
                        roadmapId, weekNumber);

        renumber(remainingSteps);
        stepRepository.saveAll(remainingSteps);
    }

    private void renumber(List<SteppieStep> steps) {
        for (int i = 0; i < steps.size(); i++) {
            steps.get(i).setStepOrder(i + 1);
        }
    }
}
