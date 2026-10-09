
package com.progresshub.habit;

public class HabitStreakResponse {

    private Long habitId;
    private String habitName;
    private int currentStreak;
    private int longestStreak;

    public HabitStreakResponse() {
    }

    public HabitStreakResponse(
            Long habitId,
            String habitName,
            int currentStreak,
            int longestStreak
    ) {
        this.habitId = habitId;
        this.habitName = habitName;
        this.currentStreak = currentStreak;
        this.longestStreak = longestStreak;
    }

    public Long getHabitId() {
        return habitId;
    }

    public void setHabitId(Long habitId) {
        this.habitId = habitId;
    }

    public String getHabitName() {
        return habitName;
    }

    public void setHabitName(String habitName) {
        this.habitName = habitName;
    }

    public int getCurrentStreak() {
        return currentStreak;
    }

    public void setCurrentStreak(int currentStreak) {
        this.currentStreak = currentStreak;
    }

    public int getLongestStreak() {
        return longestStreak;
    }

    public void setLongestStreak(int longestStreak) {
        this.longestStreak = longestStreak;
    }
}
