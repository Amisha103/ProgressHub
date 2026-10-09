
package com.progresshub.habit;

import com.progresshub.common.exception.ResourceNotFoundException;
import com.progresshub.task.DailyTask;
import com.progresshub.task.DailyTaskRepository;
import com.progresshub.task.DailyTaskStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

@Service
public class HabitStreakService {

    private static final ZoneId APP_ZONE =
            ZoneId.of("Asia/Kolkata");

    private final HabitRepository habitRepository;
    private final DailyTaskRepository dailyTaskRepository;

    public HabitStreakService(
            HabitRepository habitRepository,
            DailyTaskRepository dailyTaskRepository
    ) {
        this.habitRepository = habitRepository;
        this.dailyTaskRepository = dailyTaskRepository;
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

        int currentStreak = calculateCurrentStreak(tasks);
        int longestStreak = calculateLongestStreak(tasks);

        return new HabitStreakResponse(
                habit.getId(),
                habit.getName(),
                currentStreak,
                longestStreak
        );
    }

    private int calculateCurrentStreak(List<DailyTask> tasks) {

        if (tasks.isEmpty()) {
            return 0;
        }

        LocalDate expectedDate = LocalDate.now(APP_ZONE);
        int streak = 0;

        for (DailyTask task : tasks) {

            if (task.getTaskDate().isAfter(expectedDate)) {
                continue;
            }

            if (task.getTaskDate().isBefore(expectedDate)) {
                if (task.getTaskDate().equals(expectedDate.minusDays(1))) {
                    expectedDate = task.getTaskDate();
                } else {
                    break;
                }
            }

            if (task.getTaskDate().equals(expectedDate)
                    && task.getStatus() == DailyTaskStatus.COMPLETED) {
                streak++;
                expectedDate = expectedDate.minusDays(1);
            } else {
                break;
            }
        }

        return streak;
    }

    private int calculateLongestStreak(List<DailyTask> tasks) {

        if (tasks.isEmpty()) {
            return 0;
        }

        List<DailyTask> ascendingTasks = tasks.stream()
                .sorted((a, b) ->
                        a.getTaskDate().compareTo(b.getTaskDate()))
                .toList();

        int longest = 0;
        int current = 0;
        LocalDate previousDate = null;

        for (DailyTask task : ascendingTasks) {

            if (task.getStatus() != DailyTaskStatus.COMPLETED) {
                current = 0;
                previousDate = task.getTaskDate();
                continue;
            }

            if (previousDate != null
                    && task.getTaskDate().equals(previousDate.plusDays(1))) {
                current++;
            } else {
                current = 1;
            }

            longest = Math.max(longest, current);
            previousDate = task.getTaskDate();
        }

        return longest;
    }
}
