/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
exports.up = (pgm) => {
  pgm.sql(`
    -- Add cascading delete to matches
    ALTER TABLE matches 
    DROP CONSTRAINT IF EXISTS matches_home_team_id_fkey,
    DROP CONSTRAINT IF EXISTS matches_away_team_id_fkey;

    ALTER TABLE matches
    ADD CONSTRAINT matches_home_team_id_fkey 
    FOREIGN KEY (home_team_id) REFERENCES teams(id) ON DELETE CASCADE,
    ADD CONSTRAINT matches_away_team_id_fkey 
    FOREIGN KEY (away_team_id) REFERENCES teams(id) ON DELETE CASCADE;
  `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
exports.down = (pgm) => {
  pgm.sql(`
    -- Revert back to NO CASCADE (default)
    ALTER TABLE matches 
    DROP CONSTRAINT IF EXISTS matches_home_team_id_fkey,
    DROP CONSTRAINT IF EXISTS matches_away_team_id_fkey;

    ALTER TABLE matches
    ADD CONSTRAINT matches_home_team_id_fkey 
    FOREIGN KEY (home_team_id) REFERENCES teams(id),
    ADD CONSTRAINT matches_away_team_id_fkey 
    FOREIGN KEY (away_team_id) REFERENCES teams(id);
  `);
};
