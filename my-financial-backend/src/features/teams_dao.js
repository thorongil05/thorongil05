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
    logger.info({team: teamRow }, "Inserted team");

    // Link to competition if competitionId is provided
    if (teamEntry.competitionId) {
      // Check if link already exists - technically redundant if team is new, 
      // but good defensive practice if API allows providing an existing ID in future (though currently it creates new).
      // Since we just created a NEW team ID, it cannot be linked. So we can just insert.
      const linkQuery =
          "INSERT INTO competition_teams (competition_id, team_id) VALUES ($1, $2)";
      await client.query(linkQuery, [teamEntry.competitionId, teamId]);
      logger.info(
        `Linked team ${teamId} to competition ${teamEntry.competitionId}`,
      );
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
