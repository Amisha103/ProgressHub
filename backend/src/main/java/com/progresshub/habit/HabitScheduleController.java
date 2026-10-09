
        package com.progresshub.habit;

import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.DayOfWeek;
import java.util.List;

@RestController
@RequestMapping("/api/habits/{habitId}/schedule")
public class HabitScheduleController {

    private final HabitScheduleService habitScheduleService;

    public HabitScheduleController(
            HabitScheduleService habitScheduleService) {
        this.habitScheduleService = habitScheduleService;
    }

    @PutMapping
    public List<DayOfWeek> setSchedule(
            Authentication authentication,
            @PathVariable Long habitId,
            @Valid @RequestBody HabitScheduleRequest request) {

        return habitScheduleService.setSchedule(
                authentication.getName(),
                habitId,
                request.getDays());
    }

    @GetMapping
    public List<DayOfWeek> getSchedule(
            Authentication authentication,
            @PathVariable Long habitId) {

        return habitScheduleService.getSchedule(
                authentication.getName(),
                habitId);
    }
}
