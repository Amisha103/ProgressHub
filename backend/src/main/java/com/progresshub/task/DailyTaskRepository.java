
package com.progresshub.task;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface DailyTaskRepository
        extends JpaRepository<DailyTask, Long> {

    List<DailyTask> findByHabitUserIdAndTaskDate(
            Long userId,
            LocalDate taskDate
    );

    Optional<DailyTask> findByIdAndHabitUserId(
            Long id,
            Long userId
    );

    Optional<DailyTask> findByHabitIdAndTaskDate(
            Long habitId,
            LocalDate taskDate
    );
}
