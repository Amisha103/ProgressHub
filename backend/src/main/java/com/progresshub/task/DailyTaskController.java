
package com.progresshub.task;

import org.springframework.security.core.Authentication;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
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

    @GetMapping("/history/range")
    public List<DailyTaskResponse> getTaskHistoryRange(
            Authentication authentication,
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate startDate,
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate endDate) {

        if (startDate.isAfter(endDate)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Start date must be on or before end date");
        }

        if (ChronoUnit.DAYS.between(startDate, endDate) > 6) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Date range cannot exceed 7 days");
        }

        return dailyTaskService.getTaskHistoryRange(
                        authentication.getName(),
                        startDate,
                        endDate)
                .stream()
                .map(DailyTaskResponse::from)
                .toList();
    }
}
