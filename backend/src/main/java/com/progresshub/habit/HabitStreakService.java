
package com.progresshub.habit;

import com.progresshub.common.exception.ResourceNotFoundException;
import com.progresshub.task.DailyTask;
import com.progresshub.task.DailyTaskRepository;
import com.progresshub.task.DailyTaskStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class HabitStreakService {

    private static final ZoneId APP_ZONE =
            ZoneId.of("Asia/Kolkata");

    private final HabitRepository habitRepository;
    private final DailyTaskRepository dailyTaskRepository;
    private final HabitScheduleRepository habitScheduleRepository;

    public HabitStreakService(
            HabitRepository habitRepository,
            DailyTaskRepository dailyTaskRepository,
            HabitScheduleRepository habitScheduleRepository
    ) {
        this.habitRepository = habitRepository;
        this.dailyTaskRepository = dailyTaskRepository;
        this.habitScheduleRepository = habitScheduleRepository;
    }

    @Transactional(readOnly = true)
    public HabitStreakResponse getStreak(Long userId, Long habitId) {

        Habit habit = habitRepository
                .findByIdAndUserId(habitId, userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Habit not found"));

        List<DailyTask> tasks =
                dailyTaskRepository
                        .findByHabitIdAndTaskDateLessThanEqualOrderByTaskDateDesc(
                                habitId,
                                LocalDate.now(APP_ZONE)
                        );

        Set<DayOfWeek> scheduledDays =
                habitScheduleRepository.findByHabitId(habitId)
                        .stream()
                        .map(HabitSchedule::getDayOfWeek)
                        .collect(Collectors.toSet());

        // No schedule entries means every day is expected.
        if (scheduledDays.isEmpty()) {
            scheduledDays = Set.of(
                    DayOfWeek.MONDAY,
                    DayOfWeek.TUESDAY,
                    DayOfWeek.WEDNESDAY,
                    DayOfWeek.THURSDAY,
                    DayOfWeek.FRIDAY,
                    DayOfWeek.SATURDAY,
                    DayOfWeek.SUNDAY
            );
        }

        int currentStreak =
                calculateCurrentStreak(tasks, scheduledDays);

        int longestStreak =
                calculateLongestStreak(tasks, scheduledDays);

        return new HabitStreakResponse(
                habit.getId(),
                habit.getName(),
                currentStreak,
                longestStreak
        );
    }

    private int calculateCurrentStreak(
            List<DailyTask> tasks,
            Set<DayOfWeek> scheduledDays
    ) {
        LocalDate today = LocalDate.now(APP_ZONE);

        if (tasks.isEmpty()) {
            return 0;
        }

        var tasksByDate = tasks.stream()
                .collect(Collectors.toMap(
                        DailyTask::getTaskDate,
                        task -> task
                ));

        DailyTask todayTask = tasksByDate.get(today);

        // An explicitly skipped task today breaks the streak.
        if (todayTask != null
                && todayTask.getStatus() == DailyTaskStatus.SKIPPED) {
            return 0;
        }

        // Start today if completed; otherwise start from yesterday.
        LocalDate date = today;

        if (todayTask == null
                || todayTask.getStatus() != DailyTaskStatus.COMPLETED) {
            date = today.minusDays(1);
        }

        int streak = 0;

        // Count backward through scheduled days only.
        while (!date.isBefore(tasks.get(tasks.size() - 1).getTaskDate())) {

            if (!scheduledDays.contains(date.getDayOfWeek())) {
                date = date.minusDays(1);
                continue;
            }

            DailyTask task = tasksByDate.get(date);

            if (task == null
                    || task.getStatus() != DailyTaskStatus.COMPLETED) {
                break;
            }

            streak++;
            date = date.minusDays(1);
        }

        return streak;
    }

    private int calculateLongestStreak(
            List<DailyTask> tasks,
            Set<DayOfWeek> scheduledDays
    ) {
        if (tasks.isEmpty()) {
            return 0;
        }

        var tasksByDate = tasks.stream()
                .collect(Collectors.toMap(
                        DailyTask::getTaskDate,
                        task -> task
                ));

        LocalDate firstDate = tasks.stream()
                .map(DailyTask::getTaskDate)
                .min(LocalDate::compareTo)
                .orElseThrow();

        LocalDate lastDate = tasks.stream()
                .map(DailyTask::getTaskDate)
                .max(LocalDate::compareTo)
                .orElseThrow();

        int longest = 0;
        int current = 0;

        for (LocalDate date = firstDate;
             !date.isAfter(lastDate);
             date = date.plusDays(1)) {

            // Rest days do not break a streak.
            if (!scheduledDays.contains(date.getDayOfWeek())) {
                continue;
            }

            DailyTask task = tasksByDate.get(date);

            if (task != null
                    && task.getStatus() == DailyTaskStatus.COMPLETED) {
                current++;
                longest = Math.max(longest, current);
            } else {
                // A missing or non-completed scheduled task breaks it.
                current = 0;
            }
        }

        return longest;
    }
}
