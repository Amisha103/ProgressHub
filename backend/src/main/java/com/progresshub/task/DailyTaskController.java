
package com.progresshub.task;

import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.RequestParam;
import java.time.LocalDate;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/daily-tasks")
public class DailyTaskController {

    private final DailyTaskService dailyTaskService;

    public DailyTaskController(DailyTaskService dailyTaskService) {
        this.dailyTaskService = dailyTaskService;
    }

    @GetMapping
    public List<DailyTaskResponse> getTodayTasks(
            Authentication authentication) {

        List<DailyTask> tasks =
                dailyTaskService.getOrCreateTodayTasks(
                        authentication.getName());

        return tasks.stream()
                .map(DailyTaskResponse::from)
                .toList();
    }

    @PatchMapping("/{id}/status")
    public DailyTaskResponse updateStatus(
            Authentication authentication,
            @PathVariable Long id,
            @RequestBody UpdateDailyTaskStatusRequest request) {

        DailyTask task = dailyTaskService.updateStatus(
                authentication.getName(),
                id,
                request.getStatus());

        return DailyTaskResponse.from(task);
    }


    @GetMapping("/history")
    public List<DailyTaskResponse> getTaskHistory(
            Authentication authentication,
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate date) {

        String userEmail = authentication.getName();

        return dailyTaskService.getTaskHistory(userEmail, date)
                .stream()
                .map(DailyTaskResponse::from)
                .toList();
    }
}
