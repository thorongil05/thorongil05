const pool = require("./database");
const logger = require("pino")();

async function insert(phase) {
  const query = `
        INSERT INTO competition_phases (edition_id, name, type, order_index, metadata)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
    `;
  const values = [
    phase.editionId,
    phase.name,
    phase.type || "GROUP",
    phase.orderIndex || 0,
    phase.metadata || {},
  ];
  const { rows } = await pool.query(query, values);
  logger.info({ phase: rows[0] }, "Phase inserted");
  return rows[0];
}

async function retrieveByEdition(editionId) {
  const query = `
        SELECT * FROM competition_phases 
        WHERE edition_id = $1 
        ORDER BY order_index ASC;
    `;
  const { rows } = await pool.query(query, [editionId]);
  return rows;
}

async function update(id, phase) {
  const query = `
        UPDATE competition_phases
        SET name = $1, type = $2, order_index = $3, metadata = $4
        WHERE id = $5
        RETURNING *;
    `;
  const values = [phase.name, phase.type, phase.orderIndex, phase.metadata, id];
  const { rows } = await pool.query(query, values);
  logger.info({ phase: rows[0] }, "Phase updated");
  return rows[0];
}

async function deletePhase(id) {
  const query = "DELETE FROM competition_phases WHERE id = $1 RETURNING *;";
  const { rows } = await pool.query(query, [id]);
  logger.info({ id }, "Phase deleted");
  return rows[0];
}

module.exports = {
  insert,
  retrieveByEdition,
  update,
  deletePhase,
};
