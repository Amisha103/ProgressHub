
package com.progresshub.analytics;

import com.progresshub.task.DailyTask;
import com.progresshub.task.DailyTaskRepository;
import com.progresshub.task.DailyTaskStatus;
import com.progresshub.user.User;
import com.progresshub.user.UserRepository;
import com.progresshub.common.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.TemporalAdjusters;
import java.util.List;

@Service
public class AnalyticsService {

    private static final ZoneId APP_ZONE =
            ZoneId.of("Asia/Kolkata");

    private final DailyTaskRepository dailyTaskRepository;
    private final UserRepository userRepository;

    public AnalyticsService(
            DailyTaskRepository dailyTaskRepository,
            UserRepository userRepository
    ) {
        this.dailyTaskRepository = dailyTaskRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public WeeklyAnalyticsResponse getWeeklyAnalytics(String userEmail) {

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        LocalDate today = LocalDate.now(APP_ZONE);

        LocalDate weekStart = today.with(
                TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));

        LocalDate weekEnd = weekStart.plusDays(6);

        List<DailyTask> tasks =
                dailyTaskRepository.findByHabitUserIdAndTaskDateBetween(
                        user.getId(),
                        weekStart,
                        weekEnd
                );

        long totalTasks = tasks.size();

        long completedTasks = tasks.stream()
                .filter(task -> task.getStatus() == DailyTaskStatus.COMPLETED)
                .count();

        long pendingTasks = tasks.stream()
                .filter(task -> task.getStatus() == DailyTaskStatus.PENDING)
                .count();

        long skippedTasks = tasks.stream()
                .filter(task -> task.getStatus() == DailyTaskStatus.SKIPPED)
                .count();

        double completionRate = totalTasks == 0
                ? 0.0
                : BigDecimal.valueOf(completedTasks * 100.0 / totalTasks)
                .setScale(2, RoundingMode.HALF_UP)
                .doubleValue();

        return new WeeklyAnalyticsResponse(
                weekStart,
                weekEnd,
                totalTasks,
                completedTasks,
                pendingTasks,
                skippedTasks,
                completionRate
        );
    }

    @Transactional(readOnly = true)
    public MonthlyAnalyticsResponse getMonthlyAnalytics(String userEmail) {

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        LocalDate today = LocalDate.now(APP_ZONE);

        LocalDate monthStart = today.withDayOfMonth(1);
        LocalDate monthEnd = today.withDayOfMonth(
                today.lengthOfMonth());

        List<DailyTask> tasks =
                dailyTaskRepository.findByHabitUserIdAndTaskDateBetween(
                        user.getId(),
                        monthStart,
                        monthEnd);

        long totalTasks = tasks.size();

        long completedTasks = tasks.stream()
                .filter(task ->
                        task.getStatus() == DailyTaskStatus.COMPLETED)
                .count();

        long pendingTasks = tasks.stream()
                .filter(task ->
                        task.getStatus() == DailyTaskStatus.PENDING)
                .count();

        long skippedTasks = tasks.stream()
                .filter(task ->
                        task.getStatus() == DailyTaskStatus.SKIPPED)
                .count();

        double completionRate = totalTasks == 0
                ? 0.0
                : BigDecimal.valueOf(
                        completedTasks * 100.0 / totalTasks)
                .setScale(2, RoundingMode.HALF_UP)
                .doubleValue();

        return new MonthlyAnalyticsResponse(
                monthStart,
                monthEnd,
                totalTasks,
                completedTasks,
                pendingTasks,
                skippedTasks,
                completionRate);
    }

}
