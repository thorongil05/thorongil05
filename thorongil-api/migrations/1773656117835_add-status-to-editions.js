/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
exports.up = (pgm) => {
  pgm.addColumn("competition_editions", {
    status: {
      type: "VARCHAR(20)",
      notNull: true,
      default: "'UNKNOWN'",
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
exports.down = (pgm) => {
  pgm.dropColumn("competition_editions", "status");
};
