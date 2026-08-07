CREATE TABLE mentor_profiles (
    id                 BIGSERIAL PRIMARY KEY,
    user_id            BIGINT NOT NULL UNIQUE REFERENCES users (id) ON DELETE CASCADE,
    specialty          VARCHAR(150),
    bio                TEXT,
    years_of_experience INTEGER,
    company            VARCHAR(255),
    location           VARCHAR(255),
    is_available       BOOLEAN NOT NULL DEFAULT TRUE,
    is_featured        BOOLEAN NOT NULL DEFAULT FALSE,
    created_at         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_mentor_profiles_user ON mentor_profiles (user_id);
CREATE INDEX idx_mentor_profiles_featured ON mentor_profiles (is_featured);

CREATE TABLE mentee_profiles (
    id            BIGSERIAL PRIMARY KEY,
    user_id       BIGINT NOT NULL UNIQUE REFERENCES users (id) ON DELETE CASCADE,
    startup_stage VARCHAR(50),
    interests     TEXT,
    created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_mentee_profiles_user ON mentee_profiles (user_id);

CREATE TABLE mentorship_engagements (
    id         BIGSERIAL PRIMARY KEY,
    mentor_id  BIGINT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    mentee_id  BIGINT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    status     VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_mentorship_pair UNIQUE (mentor_id, mentee_id)
);

CREATE INDEX idx_mentorship_mentor ON mentorship_engagements (mentor_id);
CREATE INDEX idx_mentorship_mentee ON mentorship_engagements (mentee_id);
