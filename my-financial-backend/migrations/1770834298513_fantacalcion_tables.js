/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
exports.up = (pgm) => {
  pgm.sql(`
    -- Fantacalcion Teams table
    CREATE TABLE IF NOT EXISTS fantacalcion_teams (
      id SERIAL PRIMARY KEY,
      name TEXT UNIQUE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Fantacalcion Players table
    CREATE TABLE IF NOT EXISTS fantacalcion_players (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      team_id INTEGER REFERENCES fantacalcion_teams(id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Optional: Initial seed for teams if empty
    -- We can add this in a separate seed or here for convenience
    INSERT INTO fantacalcion_teams (name) VALUES 
    ('Atalanta'), ('Bologna'), ('Como'), ('Empoli'), ('Fiorentina'), 
    ('Genoa'), ('Inter'), ('Juventus'), ('Lazio'), ('Lecce'), 
    ('Milan'), ('Monza'), ('Napoli'), ('Parma'), ('Roma'), 
    ('Torino'), ('Udinese'), ('Venezia'), ('Verona'), ('Cagliari')
    ON CONFLICT (name) DO NOTHING;
  `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
exports.down = (pgm) => {
  pgm.sql(`
    DROP TABLE IF EXISTS fantacalcion_players;
    DROP TABLE IF EXISTS fantacalcion_teams;
  `);
};
