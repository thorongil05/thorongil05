/**
 * Football Archive moved to its own app and database
 * (thorongil05/football-archive). Drop its tables and the match_status type
 * from the thorongil database.
 *
 * The data was migrated on 2026-11-01 and a full dump of this database was
 * taken the same day. `down` recreates the empty schema only: restore the
 * data from that dump if needed.
 */

/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
exports.up = (pgm) => {
  pgm.sql(`
    DROP TABLE IF EXISTS matches;
    DROP TABLE IF EXISTS competition_groups;
    DROP TABLE IF EXISTS competition_phases;
    DROP TABLE IF EXISTS edition_teams;
    DROP TABLE IF EXISTS competition_editions;
    DROP TABLE IF EXISTS teams;
    DROP TABLE IF EXISTS competitions;
    DROP TYPE IF EXISTS match_status;
  `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
exports.down = (pgm) => {
  pgm.sql(`
    CREATE TYPE match_status AS ENUM (
      'SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'SUSPENDED', 'POSTPONED', 'CANCELLED', 'FORFEITED'
    );

    CREATE TABLE competitions (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      country TEXT,
      type TEXT
    );

    CREATE TABLE teams (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      city TEXT
    );

    CREATE TABLE competition_editions (
      id SERIAL PRIMARY KEY,
      competition_id INTEGER REFERENCES competitions(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      metadata JSONB DEFAULT '{}'::jsonb,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      status VARCHAR(20) DEFAULT '''UNKNOWN''' NOT NULL
    );

    CREATE TABLE edition_teams (
      edition_id INTEGER REFERENCES competition_editions(id) ON DELETE CASCADE,
      team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
      PRIMARY KEY (edition_id, team_id)
    );

    CREATE TABLE competition_phases (
      id SERIAL PRIMARY KEY,
      edition_id INTEGER NOT NULL REFERENCES competition_editions(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      type TEXT DEFAULT 'GROUP' NOT NULL,
      order_index INTEGER DEFAULT 0 NOT NULL,
      metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
    );

    CREATE TABLE competition_groups (
      id SERIAL PRIMARY KEY,
      phase_id INTEGER NOT NULL REFERENCES competition_phases(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      metadata JSONB DEFAULT '{}'::jsonb NOT NULL
    );

    CREATE TABLE matches (
      id SERIAL PRIMARY KEY,
      match_date TIMESTAMP,
      home_team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
      away_team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
      home_goals INTEGER,
      away_goals INTEGER,
      stadium TEXT,
      round TEXT,
      edition_id INTEGER REFERENCES competition_editions(id) ON DELETE CASCADE,
      phase_id INTEGER REFERENCES competition_phases(id) ON DELETE SET NULL,
      group_id INTEGER REFERENCES competition_groups(id) ON DELETE SET NULL,
      status match_status DEFAULT 'SCHEDULED' NOT NULL
    );
  `);
};
