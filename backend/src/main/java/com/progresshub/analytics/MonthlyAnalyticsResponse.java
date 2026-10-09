package com.progresshub.analytics;

import java.time.LocalDate;

public class MonthlyAnalyticsResponse {

    private LocalDate monthStart;
    private LocalDate monthEnd;
    private long totalTasks;
    private long completedTasks;
    private long pendingTasks;
    private long skippedTasks;
    private double completionRate;

    public MonthlyAnalyticsResponse(
            LocalDate monthStart,
            LocalDate monthEnd,
            long totalTasks,
            long completedTasks,
            long pendingTasks,
            long skippedTasks,
            double completionRate) {

        this.monthStart = monthStart;
        this.monthEnd = monthEnd;
        this.totalTasks = totalTasks;
        this.completedTasks = completedTasks;
        this.pendingTasks = pendingTasks;
        this.skippedTasks = skippedTasks;
        this.completionRate = completionRate;
    }

    public LocalDate getMonthStart() {
        return monthStart;
    }

    public LocalDate getMonthEnd() {
        return monthEnd;
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
