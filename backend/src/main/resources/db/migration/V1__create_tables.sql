CREATE TABLE users (
    id                         BIGSERIAL PRIMARY KEY,
    uuid                       UUID NOT NULL UNIQUE,
    first_name                 VARCHAR(100) NOT NULL,
    last_name                  VARCHAR(100) NOT NULL,
    email                      VARCHAR(150) NOT NULL UNIQUE,
    password_hash              VARCHAR(255) NOT NULL,
    is_active                  BOOLEAN NOT NULL DEFAULT TRUE,
    email_verified             BOOLEAN NOT NULL DEFAULT FALSE,
    account_non_locked         BOOLEAN NOT NULL DEFAULT TRUE,
    account_non_expired        BOOLEAN NOT NULL DEFAULT TRUE,
    credentials_non_expired    BOOLEAN NOT NULL DEFAULT TRUE,
    failed_login_attempts      INTEGER NOT NULL DEFAULT 0,
    locked_until               TIMESTAMP,
    last_login_at              TIMESTAMP,
    refresh_token_hash         VARCHAR(64),
    refresh_token_expiry       TIMESTAMP,
    verification_token         VARCHAR(255),
    verification_token_expiry  TIMESTAMP,
    password_reset_token       VARCHAR(255),
    password_reset_expiry      TIMESTAMP,
    phone_number               VARCHAR(20),
    county                     VARCHAR(100),
    town                       VARCHAR(100),
    skills                     VARCHAR(1000),
    created_at                 TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at                 TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users (email);
CREATE INDEX idx_users_uuid ON users (uuid);

CREATE TABLE roles (
    id        SERIAL PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE user_roles (
    user_id BIGINT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    role_id INTEGER NOT NULL REFERENCES roles (id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

CREATE INDEX idx_user_roles_role_id ON user_roles (role_id);

CREATE TABLE business_ideas (
    id                          BIGSERIAL PRIMARY KEY,
    mentee_id                   BIGINT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    title                       VARCHAR(255) NOT NULL,
    elevator_pitch              TEXT NOT NULL,
    detailed_description        TEXT,
    target_market               TEXT,
    unique_value_proposition    TEXT,
    execution_stage             VARCHAR(50) NOT NULL DEFAULT 'IDEATION',
    estimated_startup_cost      NUMERIC(19, 2),
    projected_monthly_revenue   NUMERIC(19, 2),
    projected_monthly_expenses  NUMERIC(19, 2),
    is_public_showcase          BOOLEAN NOT NULL DEFAULT FALSE,
    is_archived                 BOOLEAN NOT NULL DEFAULT FALSE,
    created_at                  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at                  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_business_ideas_mentee ON business_ideas (mentee_id);

CREATE TABLE business_roadmaps (
    id                            BIGSERIAL PRIMARY KEY,
    business_idea_id              BIGINT NOT NULL UNIQUE REFERENCES business_ideas (id) ON DELETE CASCADE,
    overall_completion_percentage NUMERIC(5, 2) NOT NULL DEFAULT 0,
    current_phase                 VARCHAR(50) NOT NULL DEFAULT 'IDEATION',
    started_at                    TIMESTAMP,
    expected_completion_date      DATE,
    completed_at                  TIMESTAMP,
    last_activity_at              TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at                    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at                    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE milestone_instances (
    id               BIGSERIAL PRIMARY KEY,
    roadmap_id       BIGINT NOT NULL REFERENCES business_roadmaps (id) ON DELETE CASCADE,
    sequence_order   INTEGER NOT NULL,
    task_title       VARCHAR(255) NOT NULL,
    task_description TEXT NOT NULL,
    status           VARCHAR(50) NOT NULL DEFAULT 'LOCKED',
    mentor_notes     TEXT,
    due_date         DATE,
    completed_at     TIMESTAMP,
    created_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_milestone_instances_roadmap ON milestone_instances (roadmap_id);

CREATE TABLE verification_tokens (
    id         BIGSERIAL PRIMARY KEY,
    token      UUID NOT NULL UNIQUE,
    user_id    BIGINT NOT NULL UNIQUE REFERENCES users (id) ON DELETE CASCADE,
    expires_at TIMESTAMP NOT NULL,
    used       BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_verification_token ON verification_tokens (token);
CREATE INDEX idx_verification_user ON verification_tokens (user_id);
