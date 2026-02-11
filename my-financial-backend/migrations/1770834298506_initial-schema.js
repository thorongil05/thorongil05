/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
exports.up = (pgm) => {
  pgm.sql(`
    -- Users table
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'viewer',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Competitions table
    CREATE TABLE IF NOT EXISTS competitions (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      country TEXT,
      type TEXT
    );

    -- Teams table
    CREATE TABLE IF NOT EXISTS teams (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      city TEXT
    );

    -- Join table for competitions and teams
    CREATE TABLE IF NOT EXISTS competition_teams (
      competition_id INTEGER REFERENCES competitions(id) ON DELETE CASCADE,
      team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
      PRIMARY KEY (competition_id, team_id)
    );

    -- Matches table
    CREATE TABLE IF NOT EXISTS matches (
      id SERIAL PRIMARY KEY,
      match_date DATE,
      competition_id INTEGER REFERENCES competitions(id) ON DELETE CASCADE,
      home_team_id INTEGER REFERENCES teams(id),
      away_team_id INTEGER REFERENCES teams(id),
      home_goals INTEGER,
      away_goals INTEGER,
      stadium TEXT,
      round TEXT
    );

    -- Financial Instruments
    CREATE TABLE IF NOT EXISTS financial_instruments (
      id SERIAL PRIMARY KEY,
      isin TEXT UNIQUE,
      symbol TEXT,
      name TEXT NOT NULL,
      type TEXT,
      currency TEXT,
      issue_date DATE,
      maturity_date DATE,
      issuer TEXT,
      nominal_value NUMERIC
    );

    -- Instrument Price History
    CREATE TABLE IF NOT EXISTS instrument_price_history (
      id SERIAL PRIMARY KEY,
      instrument_id INTEGER REFERENCES financial_instruments(id) ON DELETE CASCADE,
      price_date DATE NOT NULL,
      open_price NUMERIC,
      close_price NUMERIC,
      high_price NUMERIC,
      low_price NUMERIC,
      volume NUMERIC
    );

    -- Real Estates Info
    CREATE TABLE IF NOT EXISTS real_estates_info (
      id SERIAL PRIMARY KEY,
      type TEXT,
      address TEXT,
      location TEXT,
      city TEXT,
      size_sqm NUMERIC,
      price NUMERIC,
      reference_date DATE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
exports.down = (pgm) => {
  pgm.sql(`
    DROP TABLE IF EXISTS real_estates_info;
    DROP TABLE IF EXISTS instrument_price_history;
    DROP TABLE IF EXISTS financial_instruments;
    DROP TABLE IF EXISTS matches;
    DROP TABLE IF EXISTS competition_teams;
    DROP TABLE IF EXISTS teams;
    DROP TABLE IF EXISTS competitions;
    DROP TABLE IF EXISTS users;
  `);
};
