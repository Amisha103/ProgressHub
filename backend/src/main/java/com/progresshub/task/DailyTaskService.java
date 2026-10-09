
package com.progresshub.task;

import com.progresshub.habit.Habit;
import com.progresshub.habit.HabitRepository;
import com.progresshub.habit.HabitStatus;
import com.progresshub.user.User;
import com.progresshub.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;

@Service
public class DailyTaskService {

    private final DailyTaskRepository dailyTaskRepository;
    private final HabitRepository habitRepository;
    private final UserRepository userRepository;

    public DailyTaskService(
            DailyTaskRepository dailyTaskRepository,
            HabitRepository habitRepository,
            UserRepository userRepository) {
        this.dailyTaskRepository = dailyTaskRepository;
        this.habitRepository = habitRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public List<DailyTask> getOrCreateTodayTasks(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        LocalDate today = LocalDate.now();

        List<Habit> activeHabits =
                habitRepository.findByUserIdAndStatus(
                        user.getId(), HabitStatus.ACTIVE);

        for (Habit habit : activeHabits) {
            dailyTaskRepository.findByHabitIdAndTaskDate(
                    habit.getId(), today
            ).orElseGet(() -> {
                DailyTask task = new DailyTask();
                task.setHabit(habit);
                task.setTaskDate(today);
                task.setStatus(DailyTaskStatus.PENDING);
                task.setCreatedAt(OffsetDateTime.now());
                task.setUpdatedAt(OffsetDateTime.now());
                return dailyTaskRepository.save(task);
            });
        }

        return dailyTaskRepository.findByHabitUserIdAndTaskDate(
                user.getId(), today);
    }

    @Transactional
    public DailyTask updateStatus(
            String userEmail,
            Long taskId,
            DailyTaskStatus newStatus) {

        if (newStatus == null || newStatus == DailyTaskStatus.PENDING) {
            throw new IllegalArgumentException(
                    "Status must be COMPLETED or SKIPPED");
        }

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        DailyTask task = dailyTaskRepository
                .findByIdAndHabitUserId(taskId, user.getId())
                .orElseThrow(() -> new RuntimeException("Daily task not found"));

        task.setStatus(newStatus);

        if (newStatus == DailyTaskStatus.COMPLETED) {
            task.setCompletedAt(OffsetDateTime.now());
        } else {
            task.setCompletedAt(null);
        }

        return dailyTaskRepository.save(task);
    }
}
