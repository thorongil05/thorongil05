const pool = require("./database");
const logger = require("pino")();

async function insert(player) {
  const query = "INSERT INTO fantacalcion_players (name, role, team_id) VALUES ($1, $2, $3) RETURNING *;";
  const { rows } = await pool.query(query, [player.name, player.role, player.team_id]);
  logger.info({ player: rows[0] }, "Fantacalcion player inserted");
  return rows[0];
}

async function retrieveAll() {
  const query = `
    SELECT p.*, t.name as team_name 
    FROM fantacalcion_players p
    JOIN fantacalcion_teams t ON p.team_id = t.id
    ORDER BY p.name ASC;
  `;
  const { rows } = await pool.query(query);
  return rows;
}

async function update(id, player) {
  const query = "UPDATE fantacalcion_players SET name = $1, role = $2, team_id = $3 WHERE id = $4 RETURNING *;";
  const { rows } = await pool.query(query, [player.name, player.role, player.team_id, id]);
  logger.info({ player: rows[0] }, "Fantacalcion player updated");
  return rows[0];
}

async function deletePlayer(id) {
  const query = "DELETE FROM fantacalcion_players WHERE id = $1 RETURNING *;";
  const { rows } = await pool.query(query, [id]);
  logger.info({ id }, "Fantacalcion player deleted");
  return rows[0];
}

module.exports = {
  insert,
  retrieveAll,
  update,
  deletePlayer
};
