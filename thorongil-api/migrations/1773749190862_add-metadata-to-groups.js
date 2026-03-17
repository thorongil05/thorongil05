/**
 * @type {import('node-pg-migrate').MigrationBuilder}
 */
exports.up = (pgm) => {
  pgm.addColumn("competition_groups", {
    metadata: {
      type: "jsonb",
      notNull: true,
      default: "{}",
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumn("competition_groups", "metadata");
};
