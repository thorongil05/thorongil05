const pool = require("./database");
const logger = require("pino")();

async function insert(team) {
  const query = "INSERT INTO fantacalcion_teams (name) VALUES ($1) RETURNING *;";
  const { rows } = await pool.query(query, [team.name]);
  logger.info({ team: rows[0] }, "Fantacalcion team inserted");
  return rows[0];
}

async function retrieveAll() {
  const query = "SELECT * FROM fantacalcion_teams ORDER BY name ASC;";
  const { rows } = await pool.query(query);
  return rows;
}

async function update(id, team) {
  const query = "UPDATE fantacalcion_teams SET name = $1 WHERE id = $2 RETURNING *;";
  const { rows } = await pool.query(query, [team.name, id]);
  logger.info({ team: rows[0] }, "Fantacalcion team updated");
  return rows[0];
}

async function deleteTeam(id) {
  const query = "DELETE FROM fantacalcion_teams WHERE id = $1 RETURNING *;";
  const { rows } = await pool.query(query, [id]);
  logger.info({ id }, "Fantacalcion team deleted");
  return rows[0];
}

module.exports = {
  insert,
  retrieveAll,
  update,
  deleteTeam
};
