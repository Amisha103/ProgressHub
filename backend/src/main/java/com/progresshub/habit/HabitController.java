
package com.progresshub.habit;

import com.progresshub.habit.dto.CreateHabitRequest;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/habits")
public class HabitController {

    private final HabitService habitService;

    public HabitController(HabitService habitService) {
        this.habitService = habitService;
    }

    @PostMapping
    public HabitResponse createHabit(
            Authentication authentication,
            @Valid @RequestBody CreateHabitRequest request) {

        String userEmail = authentication.getName();

        Habit habit = habitService.createHabit(userEmail, request);

        return new HabitResponse(
                habit.getId(),
                habit.getCategory().getId(),
                habit.getCategory().getName(),
                habit.getName(),
                habit.getIcon(),
                habit.getColor(),
                habit.getReminderTime(),
                habit.getResetTime(),
                habit.getStatus(),
                habit.getCreatedAt(),
                habit.getUpdatedAt()
        );
    }
}

