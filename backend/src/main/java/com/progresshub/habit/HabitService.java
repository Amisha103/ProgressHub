
package com.progresshub.habit;

import com.progresshub.category.Category;
import com.progresshub.category.CategoryRepository;
import com.progresshub.user.User;
import com.progresshub.user.UserRepository;
import com.progresshub.habit.dto.CreateHabitRequest;
import org.springframework.stereotype.Service;

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

    public Habit createHabit(
            String userEmail,
            CreateHabitRequest request) {

        // Find the logged-in user.
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        // Find a category owned by this user.
        Category category = categoryRepository
                .findByIdAndUserId(
                        request.getCategoryId(),
                        user.getId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Category not found for this user"));

        // Create the habit.
        Habit habit = new Habit();
        habit.setUser(user);
        habit.setCategory(category);
        habit.setName(request.getName());
        habit.setIcon(request.getIcon());
        habit.setColor(request.getColor());
        habit.setReminderTime(request.getReminderTime());
        habit.setResetTime(request.getResetTime());
        habit.setStatus(HabitStatus.ACTIVE);

        // Save the habit in the database.
        return habitRepository.save(habit);
    }
}
