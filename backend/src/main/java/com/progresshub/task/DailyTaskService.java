
package com.progresshub.task;

import com.progresshub.common.exception.ResourceNotFoundException;
import com.progresshub.habit.Habit;
import com.progresshub.habit.HabitRepository;
import com.progresshub.habit.HabitSchedule;
import com.progresshub.habit.HabitScheduleRepository;
import com.progresshub.habit.HabitStatus;
import com.progresshub.user.User;
import com.progresshub.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.List;

@Service
public class DailyTaskService {

    private final DailyTaskRepository dailyTaskRepository;
    private final HabitRepository habitRepository;
    private final UserRepository userRepository;
    private final HabitScheduleRepository habitScheduleRepository;

    public DailyTaskService(
            DailyTaskRepository dailyTaskRepository,
            HabitRepository habitRepository,
            UserRepository userRepository,
            HabitScheduleRepository habitScheduleRepository) {

        this.dailyTaskRepository = dailyTaskRepository;
        this.habitRepository = habitRepository;
        this.userRepository = userRepository;
        this.habitScheduleRepository = habitScheduleRepository;
    }

    @Transactional
    public List<DailyTask> getOrCreateTodayTasks(String userEmail) {

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        LocalDate today = LocalDate.now(ZoneId.of("Asia/Kolkata"));

        List<Habit> activeHabits =
                habitRepository.findByUserIdAndStatus(
                        user.getId(), HabitStatus.ACTIVE);

        for (Habit habit : activeHabits) {

            // Create tasks only on scheduled days.
            if (!isHabitScheduledOn(habit, today)) {
                continue;
            }

            // Reuse an existing task or create a new pending task.
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

        // Return only tasks for habits scheduled today.
        return dailyTaskRepository.findByHabitUserIdAndTaskDate(
                        user.getId(), today)
                .stream()
                .filter(task ->
                        isHabitScheduledOn(task.getHabit(), today))
                .toList();
    }

    /**
     * Checks whether a habit is scheduled on a particular date.
     * Habits without saved schedules are treated as daily habits.
     */
    boolean isHabitScheduledOn(Habit habit, LocalDate date) {

        List<HabitSchedule> schedules =
                habitScheduleRepository.findByHabitId(habit.getId());

        if (schedules.isEmpty()) {
            return true;
        }

        return schedules.stream()
                .anyMatch(schedule ->
                        schedule.getDayOfWeek() == date.getDayOfWeek());
    }

    @Transactional
    public DailyTask updateStatus(
            String userEmail,
            Long taskId,
            DailyTaskStatus newStatus) {


        if (newStatus == null) {
            throw new IllegalArgumentException(
                    "Status cannot be null");
        }


        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        DailyTask task = dailyTaskRepository
                .findByIdAndHabitUserId(taskId, user.getId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Daily task not found"));

        task.setStatus(newStatus);

        if (newStatus == DailyTaskStatus.COMPLETED) {
            task.setCompletedAt(OffsetDateTime.now());
        } else {
            task.setCompletedAt(null);
        }

        return dailyTaskRepository.save(task);
    }

    @Transactional(readOnly = true)
    public List<DailyTask> getTaskHistory(
            String userEmail,
            LocalDate taskDate) {

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        return dailyTaskRepository
                .findByHabitUserIdAndTaskDateOrderByIdAsc(
                        user.getId(), taskDate);
    }


    @Transactional(readOnly = true)
    public List<DailyTask> getTaskHistoryRange(
            String userEmail,
            LocalDate startDate,
            LocalDate endDate) {

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        return dailyTaskRepository
                .findByHabitUserIdAndTaskDateBetween(
                        user.getId(),
                        startDate,
                        endDate);
    }

}
