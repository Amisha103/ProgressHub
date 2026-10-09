package com.progresshub.habit;

import java.time.LocalTime;
import java.time.OffsetDateTime;

public class HabitResponse {

    private Long id;
    private Long categoryId;
    private String categoryName;
    private String name;
    private String icon;
    private String color;
    private LocalTime reminderTime;
    private LocalTime resetTime;
    private HabitStatus status;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;

    public HabitResponse(
            Long id,
            Long categoryId,
            String categoryName,
            String name,
            String icon,
            String color,
            LocalTime reminderTime,
            LocalTime resetTime,
            HabitStatus status,
            OffsetDateTime createdAt,
            OffsetDateTime updatedAt) {
        this.id = id;
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.name = name;
        this.icon = icon;
        this.color = color;
        this.reminderTime = reminderTime;
        this.resetTime = resetTime;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() { return id; }
    public Long getCategoryId() { return categoryId; }
    public String getCategoryName() { return categoryName; }
    public String getName() { return name; }
    public String getIcon() { return icon; }
    public String getColor() { return color; }
    public LocalTime getReminderTime() { return reminderTime; }
    public LocalTime getResetTime() { return resetTime; }
    public HabitStatus getStatus() { return status; }
    public OffsetDateTime getCreatedAt() { return createdAt; }
    public OffsetDateTime getUpdatedAt() { return updatedAt; }
}