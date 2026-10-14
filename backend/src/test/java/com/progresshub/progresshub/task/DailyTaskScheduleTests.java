
package com.progresshub.task;

import com.progresshub.habit.Habit;
import com.progresshub.habit.HabitSchedule;
import com.progresshub.habit.HabitScheduleRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DailyTaskScheduleTests {

    @Mock
    private DailyTaskRepository dailyTaskRepository;

    @Mock
    private com.progresshub.habit.HabitRepository habitRepository;

    @Mock
    private com.progresshub.user.UserRepository userRepository;

    @Mock
    private HabitScheduleRepository habitScheduleRepository;

    @InjectMocks
    private DailyTaskService dailyTaskService;

    private Habit habit;

    @BeforeEach
    void setUp() {
        habit = new Habit();
        habit.setId(2L);
    }

    @Test
    void shouldAllowWeekdaysForMondayToFridaySchedule() {
        when(habitScheduleRepository.findByHabitId(2L))
                .thenReturn(List.of(
                        schedule(DayOfWeek.MONDAY),
                        schedule(DayOfWeek.TUESDAY),
                        schedule(DayOfWeek.WEDNESDAY),
                        schedule(DayOfWeek.THURSDAY),
                        schedule(DayOfWeek.FRIDAY)
                ));

        assertTrue(dailyTaskService.isHabitScheduledOn(
                habit, LocalDate.of(2026, 10, 12))); // Monday

        assertTrue(dailyTaskService.isHabitScheduledOn(
                habit, LocalDate.of(2026, 10, 16))); // Friday
    }

    @Test
    void shouldRejectSaturdayAndSundayForWeekdaySchedule() {
        when(habitScheduleRepository.findByHabitId(2L))
                .thenReturn(List.of(
                        schedule(DayOfWeek.MONDAY),
                        schedule(DayOfWeek.TUESDAY),
                        schedule(DayOfWeek.WEDNESDAY),
                        schedule(DayOfWeek.THURSDAY),
                        schedule(DayOfWeek.FRIDAY)
                ));

        assertFalse(dailyTaskService.isHabitScheduledOn(
                habit, LocalDate.of(2026, 10, 17))); // Saturday

        assertFalse(dailyTaskService.isHabitScheduledOn(
                habit, LocalDate.of(2026, 10, 18))); // Sunday
    }

    @Test
    void shouldTreatHabitWithoutScheduleAsDaily() {
        when(habitScheduleRepository.findByHabitId(2L))
                .thenReturn(List.of());

        assertTrue(dailyTaskService.isHabitScheduledOn(
                habit, LocalDate.of(2026, 10, 17))); // Saturday

        assertTrue(dailyTaskService.isHabitScheduledOn(
                habit, LocalDate.of(2026, 10, 18))); // Sunday
    }

    private HabitSchedule schedule(DayOfWeek day) {
        HabitSchedule schedule = new HabitSchedule();
        schedule.setHabit(habit);
        schedule.setDayOfWeek(day);
        return schedule;
    }
}
