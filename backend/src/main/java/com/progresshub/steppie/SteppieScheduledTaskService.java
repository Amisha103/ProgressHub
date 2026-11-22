
package com.progresshub.steppie;

import com.progresshub.common.exception.ResourceNotFoundException;
import com.progresshub.task.DailyTaskStatus;
import com.progresshub.user.User;
import com.progresshub.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;

@Service
public class SteppieScheduledTaskService {

    private static final ZoneId INDIA_ZONE =
            ZoneId.of("Asia/Kolkata");

    private final SteppieScheduledTaskRepository scheduledTaskRepository;
    private final SteppieRoadmapRepository roadmapRepository;
    private final SteppieStepRepository stepRepository;
    private final UserRepository userRepository;

    public SteppieScheduledTaskService(
            SteppieScheduledTaskRepository scheduledTaskRepository,
            SteppieRoadmapRepository roadmapRepository,
            SteppieStepRepository stepRepository,
            UserRepository userRepository) {

        this.scheduledTaskRepository = scheduledTaskRepository;
        this.roadmapRepository = roadmapRepository;
        this.stepRepository = stepRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public List<SteppieScheduledTask> scheduleRoadmap(
            String userEmail,
            Long roadmapId) {

        User user = getUser(userEmail);

        SteppieRoadmap roadmap = roadmapRepository
                .findByIdAndUserId(roadmapId, user.getId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Roadmap not found"));

        if (scheduledTaskRepository.existsByRoadmapIdAndUserId(
                roadmapId, user.getId())) {

            return scheduledTaskRepository
                    .findAllByRoadmapIdAndUserIdOrderByScheduledDateAsc(
                            roadmapId, user.getId());
        }

        List<SteppieStep> steps =
                stepRepository.findAllByRoadmapIdOrderByWeekNumberAscStepOrderAsc(
                        roadmapId);

        if (steps.isEmpty()) {
            throw new IllegalArgumentException(
                    "This roadmap has no steps to schedule.");
        }

        LocalDate firstDate =
                LocalDate.now(INDIA_ZONE).plusDays(1);

        List<SteppieScheduledTask> scheduledTasks = new ArrayList<>();

        for (int i = 0; i < steps.size(); i++) {
            SteppieScheduledTask task = new SteppieScheduledTask();

            task.setRoadmap(roadmap);
            task.setStep(steps.get(i));
            task.setUser(user);
            task.setScheduledDate(firstDate.plusDays(i));

            scheduledTasks.add(task);
        }
        scheduledTaskRepository.saveAll(scheduledTasks);

        return scheduledTaskRepository
                .findAllByRoadmapIdAndUserIdOrderByScheduledDateAsc(
                        roadmapId,
                        user.getId()
                );
    }

    @Transactional(readOnly = true)
    public List<SteppieScheduledTask> getTasksForDate(
            String userEmail,
            LocalDate date) {

        User user = getUser(userEmail);

        return scheduledTaskRepository
                .findAllByUserIdAndScheduledDateOrderByIdAsc(
                        user.getId(), date);
    }
    @Transactional(readOnly = true)
    public List<SteppieScheduledTask> getTasksForRoadmap(
            String userEmail,
            Long roadmapId) {

        User user = getUser(userEmail);

        roadmapRepository.findByIdAndUserId(roadmapId, user.getId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Roadmap not found"));

        return scheduledTaskRepository
                .findAllByRoadmapIdAndUserIdOrderByScheduledDateAsc(
                        roadmapId,
                        user.getId()
                );
    }
    @Transactional
    public SteppieScheduledTask updateStatus(
            String userEmail,
            Long taskId,
            DailyTaskStatus newStatus) {

        if (newStatus == null) {
            throw new IllegalArgumentException(
                    "Status cannot be null");
        }

        User user = getUser(userEmail);

        SteppieScheduledTask task = scheduledTaskRepository
                .findByIdAndUserId(taskId, user.getId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Scheduled Steppie task not found"));

        task.setStatus(newStatus);

        task.setCompletedAt(
                newStatus == DailyTaskStatus.COMPLETED
                        ? OffsetDateTime.now()
                        : null
        );

        return scheduledTaskRepository.save(task);
    }

    @Transactional
    public SteppieScheduledTask rescheduleTask(
            String userEmail,
            Long taskId,
            LocalDate newDate) {

        if (newDate == null) {
            throw new IllegalArgumentException(
                    "Scheduled date cannot be null");
        }

        User user = getUser(userEmail);

        SteppieScheduledTask task = scheduledTaskRepository
                .findByIdAndUserId(taskId, user.getId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Scheduled Steppie task not found"));

        task.setScheduledDate(newDate);

        return scheduledTaskRepository.save(task);
    }

    private User getUser(String userEmail) {
        return userRepository.findByEmail(userEmail)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));
    }
}
