/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
exports.up = (pgm) => {
  pgm.sql(`
    ALTER TABLE matches
    ALTER COLUMN match_date TYPE TIMESTAMP USING NULL;
  `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
exports.down = (pgm) => {
  pgm.sql(`
    ALTER TABLE matches
    ALTER COLUMN match_date TYPE DATE USING match_date::DATE;
  `);
};
