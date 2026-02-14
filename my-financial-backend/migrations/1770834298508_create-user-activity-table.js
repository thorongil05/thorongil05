/**
 * Migration: Create user_activity table
 * Tracks user actions for analytics and admin dashboard
 */

exports.up = (pgm) => {
  pgm.sql(`
    CREATE TABLE user_activity (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      session_id VARCHAR(255) NOT NULL,
      statistics JSONB NOT NULL DEFAULT '{}',
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT user_activity_user_session_unique UNIQUE (user_id, session_id)
    );

    CREATE INDEX idx_user_activity_user_id ON user_activity(user_id);
    CREATE INDEX idx_user_activity_session_id ON user_activity(session_id);

    COMMENT ON TABLE user_activity IS 'Tracks user activity statistics for admin dashboard analytics';
    COMMENT ON COLUMN user_activity.id IS 'Unique sequential identifier';
    COMMENT ON COLUMN user_activity.user_id IS 'Foreign key to users table';
    COMMENT ON COLUMN user_activity.session_id IS 'Session identifier for grouping activities';
    COMMENT ON COLUMN user_activity.statistics IS 'JSONB column containing activity counts (e.g., matches_added, matches_updated, teams_added)';
    COMMENT ON COLUMN user_activity.created_at IS 'Timestamp when the activity record was created';
    COMMENT ON COLUMN user_activity.updated_at IS 'Timestamp when the activity record was last updated';
  `);
};

exports.down = (pgm) => {
  pgm.sql(`
    DROP TABLE IF EXISTS user_activity;
  `);
};
