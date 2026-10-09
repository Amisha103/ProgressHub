
package com.progresshub.task;

import java.time.LocalDate;
import java.time.OffsetDateTime;

public class DailyTaskResponse {

    private Long id;
    private Long habitId;
    private String habitName;
    private LocalDate taskDate;
    private DailyTaskStatus status;
    private OffsetDateTime completedAt;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;

    public DailyTaskResponse(
            Long id,
            Long habitId,
            String habitName,
            LocalDate taskDate,
            DailyTaskStatus status,
            OffsetDateTime completedAt,
            OffsetDateTime createdAt,
            OffsetDateTime updatedAt) {
        this.id = id;
        this.habitId = habitId;
        this.habitName = habitName;
        this.taskDate = taskDate;
        this.status = status;
        this.completedAt = completedAt;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static DailyTaskResponse from(DailyTask task) {
        return new DailyTaskResponse(
                task.getId(),
                task.getHabit().getId(),
                task.getHabit().getName(),
                task.getTaskDate(),
                task.getStatus(),
                task.getCompletedAt(),
                task.getCreatedAt(),
                task.getUpdatedAt());
    }

    public Long getId() { return id; }
    public Long getHabitId() { return habitId; }
    public String getHabitName() { return habitName; }
    public LocalDate getTaskDate() { return taskDate; }
    public DailyTaskStatus getStatus() { return status; }
    public OffsetDateTime getCompletedAt() { return completedAt; }
    public OffsetDateTime getCreatedAt() { return createdAt; }
    public OffsetDateTime getUpdatedAt() { return updatedAt; }
}
