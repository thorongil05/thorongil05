const pool = require("./database");
const logger = require("pino")();

async function insert(teamEntry) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Insert Team (Allow duplicates)
    const insertTeamQuery = `
            INSERT INTO teams (name, city)
            VALUES($1, $2)
            RETURNING *;
        `;
    const insertResult = await client.query(insertTeamQuery, [
      teamEntry.name,
      teamEntry.city,
    ]);
    const teamRow = insertResult.rows[0];
    const teamId = teamRow.id;
    logger.info({ team: teamRow }, "Inserted team");

    // Link to edition if editionId is provided
    if (teamEntry.editionId) {
      const linkQuery =
        "INSERT INTO edition_teams (edition_id, team_id) VALUES ($1, $2)";
      await client.query(linkQuery, [teamEntry.editionId, teamId]);
      logger.info(`Linked team ${teamId} to edition ${teamEntry.editionId}`);
    }

    await client.query("COMMIT");
    return teamRow;
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
}

async function retrieveAll() {
  const query = `SELECT * FROM teams;`;
  const { rows } = await pool.query(query);
  return rows;
}

async function update(id, team) {
  const query = `
    UPDATE teams
    SET name = $1, city = $2
    WHERE id = $3
    RETURNING *;
  `;
  const values = [team.name, team.city, id];
  const { rows } = await pool.query(query, values);
  logger.info({ team: rows[0] }, "Team updated");
  return rows[0];
}

async function deleteTeam(id) {
  const query = "DELETE FROM teams WHERE id = $1 RETURNING *;";
  const { rows } = await pool.query(query, [id]);
  logger.info({ id }, "Team deleted");
  return rows[0];
}

module.exports = {
  insert: insert,
  retrieveAll: retrieveAll,
  update: update,
  deleteTeam: deleteTeam,
};
