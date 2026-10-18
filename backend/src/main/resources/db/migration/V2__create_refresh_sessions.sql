
CREATE TABLE refresh_sessions (
    id BIGSERIAL PRIMARY KEY,

    user_id BIGINT NOT NULL,

    token_hash VARCHAR(64) NOT NULL UNIQUE,

    expires_at TIMESTAMPTZ NOT NULL,

    revoked_at TIMESTAMPTZ,

    remember_me BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_refresh_sessions_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE INDEX idx_refresh_sessions_user_id
    ON refresh_sessions(user_id);

CREATE INDEX idx_refresh_sessions_expires_at
    ON refresh_sessions(expires_at);
