
package com.progresshub.habit;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(
        name = "habit_schedules",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uq_habit_schedule_day",
                        columnNames = {"habit_id", "day_of_week"}
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
public class HabitSchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "habit_id", nullable = false)
    private Habit habit;

    @Enumerated(EnumType.STRING)
    @Column(name = "day_of_week", nullable = false, length = 10)
    private java.time.DayOfWeek dayOfWeek;
}
