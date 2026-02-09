const pool = require("./database");
const logger = require("pino")();
const matchesDao = require("./matches_dao");
const standingsService = require("./standings_service");

async function insert(competitionEntry) {
  const query = `
        INSERT INTO competitions
            (name, country, type)
        VALUES($1, $2, $3)
        RETURNING *;
    `;

  const values = [
    competitionEntry.name,
    competitionEntry.country,
    competitionEntry.type,
  ];

  const { rows } = await pool.query(query, values);
  console.log("Inserted competition:", rows[0]);
  return rows[0];
}

async function retrieveAll() {
  const query = `SELECT * FROM competitions;`;
  const { rows } = await pool.query(query);
  return rows;
}

async function retrieveTeams(competitionId) {
  const query = `
    SELECT t.*
    FROM teams t
    JOIN competition_teams ct ON t.id = ct.team_id
    WHERE ct.competition_id = $1;
  `;
  const { rows } = await pool.query(query, [competitionId]);
  return rows;
}

async function getStandings(competitionId) {
  logger.info({ competitionId }, "Retrieving standings");
  const matches = await matchesDao.findMatches(competitionId);
  return standingsService.calculateStandings(matches);
}

module.exports = {
  insert: insert,
  retrieveAll: retrieveAll,
  retrieveTeams: retrieveTeams,
  getStandings: getStandings,
};
