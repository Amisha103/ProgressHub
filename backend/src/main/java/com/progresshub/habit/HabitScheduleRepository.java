
package com.progresshub.habit;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HabitScheduleRepository
        extends JpaRepository<HabitSchedule, Long> {

    List<HabitSchedule> findByHabitId(Long habitId);
}
