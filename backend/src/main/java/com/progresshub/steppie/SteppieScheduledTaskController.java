
package com.progresshub.steppie;


import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.progresshub.task.UpdateDailyTaskStatusRequest;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/steppie/scheduled-tasks")
public class SteppieScheduledTaskController {

    private final SteppieScheduledTaskService scheduledTaskService;

    public SteppieScheduledTaskController(
            SteppieScheduledTaskService scheduledTaskService) {
        this.scheduledTaskService = scheduledTaskService;
    }

    @PostMapping("/roadmaps/{roadmapId}")
    public List<SteppieScheduledTaskResponse> scheduleRoadmap(
            Authentication authentication,
            @PathVariable Long roadmapId) {

        return scheduledTaskService.scheduleRoadmap(
                        authentication.getName(), roadmapId)
                .stream()
                .map(SteppieScheduledTaskResponse::from)
                .toList();
    }

    @GetMapping
    public List<SteppieScheduledTaskResponse> getTasksForDate(
            Authentication authentication,
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate date) {

        return scheduledTaskService.getTasksForDate(
                        authentication.getName(), date)
                .stream()
                .map(SteppieScheduledTaskResponse::from)
                .toList();
    }

    @PatchMapping("/{id}/status")
    public SteppieScheduledTaskResponse updateStatus(
            Authentication authentication,
            @PathVariable Long id,
            @RequestBody UpdateDailyTaskStatusRequest request) {

        return SteppieScheduledTaskResponse.from(
                scheduledTaskService.updateStatus(
                        authentication.getName(),
                        id,
                        request.getStatus()
                )
        );
    }

    @PatchMapping("/{id}/date")
    public SteppieScheduledTaskResponse rescheduleTask(
            Authentication authentication,
            @PathVariable Long id,
            @RequestBody RescheduleSteppieTaskRequest request) {

        return SteppieScheduledTaskResponse.from(
                scheduledTaskService.rescheduleTask(
                        authentication.getName(),
                        id,
                        request.scheduledDate()
                )
        );
    }
    @GetMapping("/roadmaps/{roadmapId}")
    public List<SteppieScheduledTaskResponse> getTasksForRoadmap(
            Authentication authentication,
            @PathVariable Long roadmapId) {

        return scheduledTaskService.getTasksForRoadmap(
                        authentication.getName(),
                        roadmapId
                ).stream()
                .map(SteppieScheduledTaskResponse::from)
                .toList();
    }
}
