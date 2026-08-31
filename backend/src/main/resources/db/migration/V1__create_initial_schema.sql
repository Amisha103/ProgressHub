CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_categories_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT uq_categories_user_name
        UNIQUE (user_id, name)
);

CREATE TABLE habits (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    category_id BIGINT NOT NULL,
    name VARCHAR(150) NOT NULL,
    icon VARCHAR(100),
    color VARCHAR(50),
    reminder_time TIME,
    reset_time TIME,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_habits_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_habits_category
        FOREIGN KEY (category_id)
        REFERENCES categories(id)
        ON DELETE RESTRICT,

    CONSTRAINT chk_habits_status
        CHECK (status IN ('ACTIVE', 'ARCHIVED'))
);

CREATE TABLE habit_schedules (
    id BIGSERIAL PRIMARY KEY,
    habit_id BIGINT NOT NULL,
    day_of_week VARCHAR(10) NOT NULL,

    CONSTRAINT fk_habit_schedules_habit
        FOREIGN KEY (habit_id)
        REFERENCES habits(id)
        ON DELETE CASCADE,

    CONSTRAINT chk_habit_schedules_day
        CHECK (
            day_of_week IN (
                'MONDAY',
                'TUESDAY',
                'WEDNESDAY',
                'THURSDAY',
                'FRIDAY',
                'SATURDAY',
                'SUNDAY'
            )
        ),

    CONSTRAINT uq_habit_schedule_day
        UNIQUE (habit_id, day_of_week)
);

CREATE TABLE daily_tasks (
    id BIGSERIAL PRIMARY KEY,
    habit_id BIGINT NOT NULL,
    task_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    completed_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_daily_tasks_habit
        FOREIGN KEY (habit_id)
        REFERENCES habits(id)
        ON DELETE CASCADE,

    CONSTRAINT chk_daily_tasks_status
        CHECK (
            status IN (
                'PENDING',
                'COMPLETED',
                'SKIPPED'
            )
        ),

    CONSTRAINT uq_daily_task_habit_date
        UNIQUE (habit_id, task_date)
);

CREATE INDEX idx_categories_user_id
    ON categories(user_id);

CREATE INDEX idx_habits_user_id
    ON habits(user_id);

CREATE INDEX idx_habits_category_id
    ON habits(category_id);

CREATE INDEX idx_habit_schedules_habit_id
    ON habit_schedules(habit_id);

CREATE INDEX idx_daily_tasks_habit_id
    ON daily_tasks(habit_id);

CREATE INDEX idx_daily_tasks_task_date
    ON daily_tasks(task_date);

CREATE INDEX idx_daily_tasks_status
    ON daily_tasks(status);