const pool = require("./database");
const logger = require("pino")();
const matchesDao = require("./matches_dao");
const standingsService = require("./standings_service");

async function insert(competitionEntry) {
  const query = `
    INSERT INTO competitions
        (name, country, type, metadata)
    VALUES($1, $2, $3, $4)
    RETURNING *;
`;

  const values = [
    competitionEntry.name,
    competitionEntry.country,
    competitionEntry.type,
    competitionEntry.metadata || {},
  ];

  const { rows } = await pool.query(query, values);
  logger.info({ competition: rows[0] }, "Inserted competition");
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

async function update(id, competitionEntry) {
  const query = `
    UPDATE competitions
    SET name = $1, country = $2, type = $3, metadata = $4
    WHERE id = $5
    RETURNING *;
  `;

  const values = [
    competitionEntry.name,
    competitionEntry.country,
    competitionEntry.type,
    competitionEntry.metadata || {},
    id,
  ];

  const { rows } = await pool.query(query, values);
  if (rows.length === 0) {
    throw new Error(`Competition with id ${id} not found`);
  }
  logger.info({ competition: rows[0] }, "Updated competition");
  return rows[0];
}

async function getStandings(competitionId, args = {}) {
  logger.info({ competitionId }, "Retrieving standings");
  const matches = await matchesDao.findMatches(competitionId);
  const totalRounds = matches
    .map((match) => match.round)
    .reduce((max, round) => Math.max(max, round), 0);
  let { startInterval, endInterval } = {
    startInterval: 1,
    endInterval: totalRounds,
  };

  if (args && args.startInterval) {
    startInterval = args.startInterval;
  }
  if (args && args.endInterval) {
    endInterval = args.endInterval;
  }
  return {
    totalRounds: totalRounds,
    startInterval: startInterval,
    endInterval: endInterval,
    standings: standingsService.calculateStandings(
      matches,
      startInterval,
      endInterval,
    ),
  };
}

module.exports = {
  insert: insert,
  retrieveAll: retrieveAll,
  retrieveTeams: retrieveTeams,
  getStandings: getStandings,
  update: update,
};
