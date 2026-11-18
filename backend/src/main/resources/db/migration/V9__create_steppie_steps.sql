
CREATE TABLE steppie_steps (
    id BIGSERIAL PRIMARY KEY,

    roadmap_id BIGINT NOT NULL,

    week_number INTEGER NOT NULL,

    step_order INTEGER NOT NULL,

    title VARCHAR(300) NOT NULL,

    description VARCHAR(2000) NOT NULL,

    estimated_minutes INTEGER,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_steppie_step_roadmap
        FOREIGN KEY (roadmap_id)
        REFERENCES steppie_roadmaps(id)
        ON DELETE CASCADE,

    CONSTRAINT chk_steppie_week
        CHECK (week_number > 0),

    CONSTRAINT chk_steppie_step_order
        CHECK (step_order > 0),

    CONSTRAINT chk_steppie_estimated_minutes
        CHECK (estimated_minutes IS NULL OR estimated_minutes > 0)
);

CREATE INDEX idx_steppie_steps_roadmap_id
    ON steppie_steps(roadmap_id);
