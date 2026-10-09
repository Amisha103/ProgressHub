
package com.progresshub.analytics;

import java.time.LocalDate;

public class WeeklyAnalyticsResponse {

    private LocalDate weekStart;
    private LocalDate weekEnd;
    private long totalTasks;
    private long completedTasks;
    private long pendingTasks;
    private long skippedTasks;
    private double completionRate;

    public WeeklyAnalyticsResponse(
            LocalDate weekStart,
            LocalDate weekEnd,
            long totalTasks,
            long completedTasks,
            long pendingTasks,
            long skippedTasks,
            double completionRate
    ) {
        this.weekStart = weekStart;
        this.weekEnd = weekEnd;
        this.totalTasks = totalTasks;
        this.completedTasks = completedTasks;
        this.pendingTasks = pendingTasks;
        this.skippedTasks = skippedTasks;
        this.completionRate = completionRate;
    }

    public LocalDate getWeekStart() {
        return weekStart;
    }

    public LocalDate getWeekEnd() {
        return weekEnd;
    }

    public long getTotalTasks() {
        return totalTasks;
    }

    public long getCompletedTasks() {
        return completedTasks;
    }

    public long getPendingTasks() {
        return pendingTasks;
    }

    public long getSkippedTasks() {
        return skippedTasks;
    }

    public double getCompletionRate() {
        return completionRate;
    }
}
