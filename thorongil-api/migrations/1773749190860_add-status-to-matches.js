/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
exports.up = (pgm) => {
  pgm.createType("match_status", [
    "SCHEDULED",
    "IN_PROGRESS",
    "COMPLETED",
    "SUSPENDED",
    "POSTPONED",
    "CANCELLED",
    "FORFEITED",
  ]);

  pgm.addColumn("matches", {
    status: {
      type: "match_status",
      notNull: true,
      default: "SCHEDULED",
    },
  });

  pgm.sql(`
    UPDATE matches
    SET status = CASE
      WHEN home_goals IS NOT NULL AND away_goals IS NOT NULL THEN 'COMPLETED'::match_status
      ELSE 'SCHEDULED'::match_status
    END
  `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
exports.down = (pgm) => {
  pgm.dropColumn("matches", "status");
  pgm.dropType("match_status");
};
