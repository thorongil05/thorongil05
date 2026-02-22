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
  logger.info({ competition: rows[0] }, "Inserted competition");
  return rows[0];
}

async function insertEdition(editionEntry) {
  const query = `
    INSERT INTO competition_editions (competition_id, name, metadata)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const values = [
    editionEntry.competitionId,
    editionEntry.name,
    editionEntry.metadata || {},
  ];
  const { rows } = await pool.query(query, values);
  return rows[0];
}

async function retrieveEditions(competitionId) {
  const query = `SELECT * FROM competition_editions WHERE competition_id = $1 ORDER BY created_at DESC;`;
  const { rows } = await pool.query(query, [competitionId]);
  return rows;
}

async function retrieveAll() {
  const query = `SELECT * FROM competitions;`;
  const { rows } = await pool.query(query);
  return rows;
}

async function retrieveTeams(editionId) {
  const query = `
    SELECT t.*
    FROM teams t
    JOIN edition_teams et ON t.id = et.team_id
    WHERE et.edition_id = $1;
  `;
  const { rows } = await pool.query(query, [editionId]);
  return rows;
}

async function update(id, competitionEntry) {
  const query = `
    UPDATE competitions
    SET name = $1, country = $2, type = $3
    WHERE id = $4
    RETURNING *;
  `;

  const values = [
    competitionEntry.name,
    competitionEntry.country,
    competitionEntry.type,
    id,
  ];

  const { rows } = await pool.query(query, values);
  if (rows.length === 0) {
    throw new Error(`Competition with id ${id} not found`);
  }
  logger.info({ competition: rows[0] }, "Updated competition");
  return rows[0];
}

async function updateEdition(id, editionEntry) {
  const query = `
    UPDATE competition_editions
    SET name = $1, metadata = $2
    WHERE id = $3
    RETURNING *;
  `;
  const values = [editionEntry.name, editionEntry.metadata || {}, id];
  const { rows } = await pool.query(query, values);
  return rows[0];
}

async function getStandings(editionId, args = {}) {
  logger.info({ editionId, args }, "Retrieving standings");
  const matches = await matchesDao.findMatches(
    null,
    null,
    null,
    "match_date",
    "DESC",
    editionId,
    args.phaseId,
    args.groupId,
  );
  const totalRounds = matches
    .map((match) => match.round)
    .reduce(
      (max, round) =>
        Math.max(max, isNaN(parseInt(round)) ? max : parseInt(round)),
      0,
    );
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
  insertEdition: insertEdition,
  retrieveAll: retrieveAll,
  retrieveEditions: retrieveEditions,
  retrieveTeams: retrieveTeams,
  getStandings: getStandings,
  update: update,
  updateEdition: updateEdition,
};
