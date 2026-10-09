
package com.progresshub.habit;

import com.progresshub.habit.dto.CreateHabitRequest;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.progresshub.user.User;
import com.progresshub.user.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

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
                .map(habit -> new HabitResponse(
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
                ))
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

    @PatchMapping("/{id}/archive")
    public HabitResponse archiveHabit(
            Authentication authentication,
            @PathVariable Long id) {

        String userEmail = authentication.getName();

        Habit habit = habitService.archiveHabit(userEmail, id);

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

}

