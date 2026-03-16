/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
exports.up = (pgm) => {
  pgm.sql(`
    -- 1. Create competition_editions table
    CREATE TABLE IF NOT EXISTS competition_editions (
      id SERIAL PRIMARY KEY,
      competition_id INTEGER REFERENCES competitions(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      metadata JSONB DEFAULT '{}',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- 2. Create edition_teams join table
    CREATE TABLE IF NOT EXISTS edition_teams (
      edition_id INTEGER REFERENCES competition_editions(id) ON DELETE CASCADE,
      team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
      PRIMARY KEY (edition_id, team_id)
    );

    -- 3. Add edition_id to matches
    ALTER TABLE matches ADD COLUMN edition_id INTEGER REFERENCES competition_editions(id) ON DELETE CASCADE;

    -- 4. Data Migration: Create a default edition for each existing competition
    INSERT INTO competition_editions (competition_id, name, metadata)
    SELECT id, 'Default Edition', metadata FROM competitions;

    -- 5. Data Migration: Link teams to the new editions
    INSERT INTO edition_teams (edition_id, team_id)
    SELECT ce.id, ct.team_id
    FROM competition_teams ct
    JOIN competition_editions ce ON ct.competition_id = ce.competition_id;

    -- 6. Data Migration: Link matches to the new editions
    UPDATE matches m
    SET edition_id = ce.id
    FROM competition_editions ce
    WHERE m.competition_id = ce.competition_id;

    -- 7. Cleanup obsolete structures
    DROP TABLE IF EXISTS competition_teams;
    ALTER TABLE competitions DROP COLUMN IF EXISTS metadata;
    ALTER TABLE matches DROP COLUMN IF EXISTS competition_id;
  `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
exports.down = (pgm) => {
  // Reversing this fully is complex due to schema destruction,
  // but we can restore the main columns if needed.
  pgm.sql(`
    -- Reverse is omitted for this structural change to avoid data corruption risks.
    -- Manual intervention suggested for rollback.
  `);
};
