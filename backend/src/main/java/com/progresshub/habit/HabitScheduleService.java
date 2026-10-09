
        package com.progresshub.habit;

import com.progresshub.common.exception.ResourceNotFoundException;
import com.progresshub.user.User;
import com.progresshub.user.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.util.Comparator;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class HabitScheduleService {

    private final HabitScheduleRepository habitScheduleRepository;
    private final HabitRepository habitRepository;
    private final UserRepository userRepository;

    public HabitScheduleService(
            HabitScheduleRepository habitScheduleRepository,
            HabitRepository habitRepository,
            UserRepository userRepository) {
        this.habitScheduleRepository = habitScheduleRepository;
        this.habitRepository = habitRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public List<DayOfWeek> setSchedule(
            String userEmail,
            Long habitId,
            Set<DayOfWeek> days) {

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        Habit habit = habitRepository
                .findByIdAndUserId(habitId, user.getId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Habit not found"));

        if (days == null || days.isEmpty()) {
            throw new IllegalArgumentException(
                    "Select at least one scheduled day");
        }

        List<HabitSchedule> existingSchedules =
                habitScheduleRepository.findByHabitId(habitId);

        habitScheduleRepository.deleteAll(existingSchedules);

        List<HabitSchedule> newSchedules = days.stream()
                .map(day -> {
                    HabitSchedule schedule = new HabitSchedule();
                    schedule.setHabit(habit);
                    schedule.setDayOfWeek(day);
                    return schedule;
                })
                .toList();

        List<HabitSchedule> savedSchedules =
                habitScheduleRepository.saveAll(newSchedules);

        return savedSchedules.stream()
                .map(HabitSchedule::getDayOfWeek)
                .sorted(Comparator.comparingInt(DayOfWeek::getValue))
                .toList();
    }

    @Transactional
    public List<DayOfWeek> getSchedule(
            String userEmail,
            Long habitId) {

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        habitRepository.findByIdAndUserId(habitId, user.getId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Habit not found"));

        return habitScheduleRepository.findByHabitId(habitId)
                .stream()
                .map(HabitSchedule::getDayOfWeek)
                .sorted(Comparator.comparingInt(DayOfWeek::getValue))
                .collect(Collectors.toList());
    }
}
