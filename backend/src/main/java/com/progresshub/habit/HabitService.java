
package com.progresshub.habit;

import com.progresshub.category.Category;
import com.progresshub.category.CategoryRepository;
import com.progresshub.user.User;
import com.progresshub.user.UserRepository;
import com.progresshub.habit.dto.CreateHabitRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HabitService {

    private final HabitRepository habitRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;

    public HabitService(
            HabitRepository habitRepository,
            UserRepository userRepository,
            CategoryRepository categoryRepository) {
        this.habitRepository = habitRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
    }

    public Habit updateHabit(
            String userEmail,
            Long habitId,
            CreateHabitRequest request) {

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Habit habit = habitRepository
                .findByIdAndUserId(habitId, user.getId())
                .orElseThrow(() ->
                        new RuntimeException("Habit not found"));

        Category category = null;

        if (request.getCategoryId() != null) {
            category = categoryRepository
                    .findByIdAndUserId(
                            request.getCategoryId(),
                            user.getId())
                    .orElseThrow(() ->
                            new RuntimeException(
                                    "Category not found for this user"));
        }

        habit.setCategory(category);
        habit.setName(request.getName());
        habit.setIcon(request.getIcon());
        habit.setColor(request.getColor());
        habit.setReminderTime(request.getReminderTime());
        habit.setResetTime(request.getResetTime());

        return habitRepository.save(habit);
    }

    public List<Habit> getHabits(String userEmail) {

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        return habitRepository.findByUserIdAndStatus(
                user.getId(),
                HabitStatus.ACTIVE
        );
    }

    public Habit createHabit(
            String userEmail,
            CreateHabitRequest request) {

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Category category = null;

        if (request.getCategoryId() != null) {
            category = categoryRepository
                    .findByIdAndUserId(
                            request.getCategoryId(),
                            user.getId())
                    .orElseThrow(() ->
                            new RuntimeException(
                                    "Category not found for this user"));
        }

        Habit habit = new Habit();
        habit.setUser(user);
        habit.setCategory(category);
        habit.setName(request.getName());
        habit.setIcon(request.getIcon());
        habit.setColor(request.getColor());
        habit.setReminderTime(request.getReminderTime());
        habit.setResetTime(request.getResetTime());
        habit.setStatus(HabitStatus.ACTIVE);

        return habitRepository.save(habit);
    }

    public Habit archiveHabit(String userEmail, Long habitId) {

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Habit habit = habitRepository
                .findByIdAndUserId(habitId, user.getId())
                .orElseThrow(() ->
                        new RuntimeException("Habit not found"));

        habit.setStatus(HabitStatus.ARCHIVED);

        return habitRepository.save(habit);
    }
}
