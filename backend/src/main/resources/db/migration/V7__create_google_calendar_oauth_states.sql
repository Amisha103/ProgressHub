
CREATE TABLE google_calendar_oauth_states (
    id BIGSERIAL PRIMARY KEY,
    state_hash VARCHAR(64) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_google_calendar_oauth_state_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE INDEX idx_google_calendar_oauth_states_expires_at
    ON google_calendar_oauth_states(expires_at);
