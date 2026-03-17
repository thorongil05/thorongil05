const pool = require("./database");
const logger = require("pino")();

async function insert(group) {
  const query = `
        INSERT INTO competition_groups (phase_id, name, metadata)
        VALUES ($1, $2, $3)
        RETURNING *;
    `;
  const values = [group.phaseId, group.name, group.metadata || {}];
  const { rows } = await pool.query(query, values);
  logger.info({ group: rows[0] }, "Group inserted");
  return mapRowToGroup(rows[0]);
}

async function retrieveByPhase(phaseId) {
  const query = `
        SELECT * FROM competition_groups 
        WHERE phase_id = $1 
        ORDER BY name ASC;
    `;
  const { rows } = await pool.query(query, [phaseId]);
  return rows.map(mapRowToGroup);
}

async function deleteGroup(id) {
  const query = "DELETE FROM competition_groups WHERE id = $1 RETURNING *;";
  const { rows } = await pool.query(query, [id]);
  logger.info({ id }, "Group deleted");
  return mapRowToGroup(rows[0]);
}

async function update(id, group) {
  const query = `
        UPDATE competition_groups
        SET name = $1, metadata = $2
        WHERE id = $3
        RETURNING *;
    `;
  const values = [group.name, group.metadata || {}, id];
  const { rows } = await pool.query(query, values);
  logger.info({ group: rows[0] }, "Group updated");
  return mapRowToGroup(rows[0]);
}

function mapRowToGroup(row) {
  if (!row) return null;
  return {
    id: row.id,
    phaseId: row.phase_id,
    name: row.name,
    metadata: row.metadata || {},
  };
}

module.exports = {
  insert,
  retrieveByPhase,
  update,
  deleteGroup,
};
