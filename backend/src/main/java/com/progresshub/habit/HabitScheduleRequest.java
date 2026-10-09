package com.progresshub.habit;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.time.DayOfWeek;
import java.util.Set;

public class HabitScheduleRequest {

    @NotNull(message = "Scheduled days must be provided")
    @NotEmpty(message = "Select at least one day")
    private Set<DayOfWeek> days;

    public Set<DayOfWeek> getDays() {
        return days;
    }

    public void setDays(Set<DayOfWeek> days) {
        this.days = days;
    }
}
