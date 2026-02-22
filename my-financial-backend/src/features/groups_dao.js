const pool = require("./database");
const logger = require("pino")();

async function insert(group) {
  const query = `
        INSERT INTO competition_groups (phase_id, name)
        VALUES ($1, $2)
        RETURNING *;
    `;
  const values = [group.phaseId, group.name];
  const { rows } = await pool.query(query, values);
  logger.info({ group: rows[0] }, "Group inserted");
  return rows[0];
}

async function retrieveByPhase(phaseId) {
  const query = `
        SELECT * FROM competition_groups 
        WHERE phase_id = $1 
        ORDER BY name ASC;
    `;
  const { rows } = await pool.query(query, [phaseId]);
  return rows;
}

async function deleteGroup(id) {
  const query = "DELETE FROM competition_groups WHERE id = $1 RETURNING *;";
  const { rows } = await pool.query(query, [id]);
  logger.info({ id }, "Group deleted");
  return rows[0];
}

module.exports = {
  insert,
  retrieveByPhase,
  deleteGroup,
};
