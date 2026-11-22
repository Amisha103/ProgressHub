
CREATE TABLE steppie_scheduled_tasks (
    id BIGSERIAL PRIMARY KEY,

    roadmap_id BIGINT NOT NULL,
    step_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,

    scheduled_date DATE NOT NULL,

    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    completed_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_steppie_scheduled_roadmap
        FOREIGN KEY (roadmap_id)
        REFERENCES steppie_roadmaps(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_steppie_scheduled_step
        FOREIGN KEY (step_id)
        REFERENCES steppie_steps(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_steppie_scheduled_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT uk_steppie_scheduled_user_step
        UNIQUE (user_id, step_id),

    CONSTRAINT chk_steppie_scheduled_status
        CHECK (status IN ('PENDING', 'COMPLETED'))
);

CREATE INDEX idx_steppie_scheduled_user_date
    ON steppie_scheduled_tasks(user_id, scheduled_date);

CREATE INDEX idx_steppie_scheduled_roadmap
    ON steppie_scheduled_tasks(roadmap_id);
