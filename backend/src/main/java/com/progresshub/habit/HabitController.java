
package com.progresshub.habit;

import com.progresshub.habit.dto.CreateHabitRequest;
import com.progresshub.user.User;
import com.progresshub.user.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/habits")
public class HabitController {

    private final HabitService habitService;
    private final HabitStreakService habitStreakService;
    private final UserRepository userRepository;

    public HabitController(
            HabitService habitService,
            HabitStreakService habitStreakService,
            UserRepository userRepository
    ) {
        this.habitService = habitService;
        this.habitStreakService = habitStreakService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<HabitResponse> getHabits(Authentication authentication) {

        String userEmail = authentication.getName();

        List<Habit> habits = habitService.getHabits(userEmail);

        return habits.stream()
                .map(this::toHabitResponse)
                .toList();
    }

    @PutMapping("/{id}")
    public HabitResponse updateHabit(
            Authentication authentication,
            @PathVariable Long id,
            @Valid @RequestBody CreateHabitRequest request) {

        String userEmail = authentication.getName();

        Habit habit = habitService.updateHabit(
                userEmail, id, request);

        return toHabitResponse(habit);
    }

    @PostMapping
    public HabitResponse createHabit(
            Authentication authentication,
            @Valid @RequestBody CreateHabitRequest request) {

        String userEmail = authentication.getName();

        Habit habit = habitService.createHabit(userEmail, request);

        return toHabitResponse(habit);
    }

    @PatchMapping("/{id}/archive")
    public HabitResponse archiveHabit(
            Authentication authentication,
            @PathVariable Long id) {

        String userEmail = authentication.getName();

        Habit habit = habitService.archiveHabit(userEmail, id);

        return toHabitResponse(habit);
    }

    @GetMapping("/{id}/streak")
    public HabitStreakResponse getHabitStreak(
            Authentication authentication,
            @PathVariable("id") Long habitId
    ) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "User not found"));

        return habitStreakService.getStreak(user.getId(), habitId);
    }

    private HabitResponse toHabitResponse(Habit habit) {

        Long categoryId = habit.getCategory() != null
                ? habit.getCategory().getId()
                : null;

        String categoryName = habit.getCategory() != null
                ? habit.getCategory().getName()
                : null;

        return new HabitResponse(
                habit.getId(),
                categoryId,
                categoryName,
                habit.getName(),
                habit.getIcon(),
                habit.getColor(),
                habit.getReminderTime(),
                habit.getResetTime(),
                habit.getScheduledDays(),
                habit.getStatus(),
                habit.getCreatedAt(),
                habit.getUpdatedAt()
        );
    }
}
