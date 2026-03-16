/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
exports.up = (pgm) => {
  // 1. Create competition_phases table
  pgm.createTable("competition_phases", {
    id: "id",
    edition_id: {
      type: "integer",
      notNull: true,
      references: '"competition_editions"',
      onDelete: "CASCADE",
    },
    name: { type: "text", notNull: true },
    type: { type: "text", notNull: true, default: "GROUP" }, // GROUP or KNOCKOUT
    order_index: { type: "integer", notNull: true, default: 0 },
    metadata: { type: "jsonb", notNull: true, default: "{}" },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });

  // 2. Create competition_groups table
  pgm.createTable("competition_groups", {
    id: "id",
    phase_id: {
      type: "integer",
      notNull: true,
      references: '"competition_phases"',
      onDelete: "CASCADE",
    },
    name: { type: "text", notNull: true },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });

  // 3. Add phase_id and group_id to matches
  pgm.addColumns("matches", {
    phase_id: {
      type: "integer",
      references: '"competition_phases"',
      onDelete: "SET NULL",
    },
    group_id: {
      type: "integer",
      references: '"competition_groups"',
      onDelete: "SET NULL",
    },
  });

  // 4. Data Migration: Create a default phase for each existing edition and link matches
  pgm.sql(`
    INSERT INTO competition_phases (edition_id, name, type, order_index)
    SELECT id, 'Stagione Regolare', 'GROUP', 0
    FROM competition_editions;

    UPDATE matches m
    SET phase_id = cp.id
    FROM competition_phases cp
    WHERE m.edition_id = cp.edition_id AND cp.name = 'Stagione Regolare';
  `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
exports.down = (pgm) => {
  pgm.dropColumns("matches", ["phase_id", "group_id"]);
  pgm.dropTable("competition_groups");
  pgm.dropTable("competition_phases");
};
