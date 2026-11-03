CREATE TABLE habit_days (
    habit_id BIGINT NOT NULL,
    day_of_week VARCHAR(10) NOT NULL,

    CONSTRAINT fk_habit_days_habit
        FOREIGN KEY (habit_id)
        REFERENCES habits(id)
        ON DELETE CASCADE,

    CONSTRAINT pk_habit_days
        PRIMARY KEY (habit_id, day_of_week)
);