/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
exports.up = (pgm) => {
  // 1. For every phase of type 'GROUP' that has no groups, create a default 'Girone Unico'
  pgm.sql(`
    INSERT INTO competition_groups (phase_id, name)
    SELECT cp.id, 'Girone Unico'
    FROM competition_phases cp
    LEFT JOIN competition_groups cg ON cp.id = cg.phase_id
    WHERE cp.type = 'GROUP' AND cg.id IS NULL;
  `);

  // 2. Assign all matches that are currently missing a group_id (but belong to a GROUP phase)
  // to the first available group of that phase.
  pgm.sql(`
    UPDATE matches m
    SET group_id = sub.group_id
    FROM (
      SELECT DISTINCT ON (cp.id) cp.id as phase_id, cg.id as group_id
      FROM competition_phases cp
      JOIN competition_groups cg ON cp.id = cg.phase_id
      WHERE cp.type = 'GROUP'
      ORDER BY cp.id, cg.id ASC
    ) sub
    WHERE m.phase_id = sub.phase_id AND m.group_id IS NULL;
  `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
exports.down = (pgm) => {
  // No easy way to undo this data migration without potentially breaking new data,
  // but we could set group_id back to null for these matches if we tracked them.
  // Given it's a "repair" migration, down can be empty or just a log.
};
