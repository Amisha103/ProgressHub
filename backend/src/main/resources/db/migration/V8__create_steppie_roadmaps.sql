
CREATE TABLE steppie_roadmaps (
    id BIGSERIAL PRIMARY KEY,

    user_id BIGINT NOT NULL,

    goal VARCHAR(1000) NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_steppie_roadmap_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE INDEX idx_steppie_roadmaps_user_id
    ON steppie_roadmaps(user_id);
