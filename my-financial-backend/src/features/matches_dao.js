const pool = require("./database");
const logger = require("pino")();

async function insert(matchEntry) {
  const query = `
        INSERT INTO matches
            (match_date, edition_id, phase_id, group_id, home_team_id, away_team_id, home_goals, away_goals, stadium, round)
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *;
    `;

  const values = [
    matchEntry.matchDate,
    matchEntry.editionId,
    matchEntry.phaseId,
    matchEntry.groupId,
    matchEntry.homeTeamId,
    matchEntry.awayTeamId,
    matchEntry.homeGoals,
    matchEntry.awayGoals,
    matchEntry.stadium,
    matchEntry.round,
  ];

  const { rows } = await pool.query(query, values);
  logger.info({ match: rows[0] }, "Match inserted in Database");
  return rows[0];
}

async function findMatches(
  competitionId = null,
  round = null,
  teamId = null,
  sortBy = "match_date",
  sortOrder = "DESC",
  editionId = null,
  phaseId = null,
  groupId = null,
) {
  logger.info(
    {
      competitionId,
      round,
      teamId,
      sortBy,
      sortOrder,
      editionId,
      phaseId,
      groupId,
    },
    "Retrieving matches",
  );
  let query = `
    SELECT
      m.*,
      ht.name as home_team_name,
      ht.city as home_team_city,
      at.name as away_team_name,
      at.city as away_team_city
    FROM matches m
    JOIN teams ht ON m.home_team_id = ht.id
    JOIN teams at ON m.away_team_id = at.id
  `;

  const values = [];
  let whereClause = [];

  if (editionId) {
    values.push(editionId);
    whereClause.push(`m.edition_id = $${values.length}`);
  }

  if (phaseId) {
    values.push(phaseId);
    whereClause.push(`m.phase_id = $${values.length}`);
  }

  if (groupId) {
    values.push(groupId);
    whereClause.push(`m.group_id = $${values.length}`);
  }

  if (round) {
    values.push(round);
    whereClause.push(`m.round = $${values.length}`);
  }

  if (teamId) {
    values.push(teamId);
    whereClause.push(
      `(m.home_team_id = $${values.length} OR m.away_team_id = $${values.length})`,
    );
  }

  if (whereClause.length > 0) {
    query += " WHERE " + whereClause.join(" AND ");
  }

  // Handle dynamic sorting
  const order = sortOrder.toUpperCase() === "ASC" ? "ASC" : "DESC";
  if (sortBy === "round") {
    query += ` ORDER BY LENGTH(m.round) ${order}, m.round ${order}, m.id ${order}`;
  } else {
    // Default to match_date
    query += ` ORDER BY m.match_date ${order}, m.id ${order}`;
  }

  const { rows } = await pool.query(query, values);

  const domainMatches = rows.map((row) => ({
    id: row.id,
    matchDate: row.match_date,
    editionId: row.edition_id,
    phaseId: row.phase_id,
    groupId: row.group_id,
    homeScore: row.home_goals,
    awayScore: row.away_goals,
    stadium: row.stadium,
    round: row.round,
    homeTeam: {
      id: row.home_team_id,
      name: row.home_team_name,
      city: row.home_team_city,
    },
    awayTeam: {
      id: row.away_team_id,
      name: row.away_team_name,
      city: row.away_team_city,
    },
  }));

  logger.info({ count: domainMatches.length }, "Retrieved matches");

  return domainMatches;
}

async function findRounds(editionId) {
  logger.info({ editionId }, "Retrieving rounds");
  const query = `
    SELECT round
    FROM matches
    WHERE edition_id = $1
    GROUP BY round
    ORDER BY LENGTH(round), round
  `;
  const { rows } = await pool.query(query, [editionId]);
  return rows.map((r) => r.round).filter((r) => r);
}

async function update(id, match) {
  const query = `
    UPDATE matches
    SET match_date = $1, 
        edition_id = $2, 
        phase_id = $3,
        group_id = $4,
        home_team_id = $5, 
        away_team_id = $6, 
        home_goals = $7, 
        away_goals = $8, 
        stadium = $9, 
        round = $10
    WHERE id = $11
    RETURNING *;
  `;

  const values = [
    match.matchDate,
    match.editionId,
    match.phaseId,
    match.groupId,
    match.homeTeamId,
    match.awayTeamId,
    match.homeGoals,
    match.awayGoals,
    match.stadium,
    match.round,
    id,
  ];

  const { rows } = await pool.query(query, values);
  logger.info({ match: rows[0] }, "Match updated");
  return rows[0];
}

async function deleteMatch(id) {
  const query = "DELETE FROM matches WHERE id = $1 RETURNING *;";
  const { rows } = await pool.query(query, [id]);
  logger.info({ id }, "Match deleted");
  return rows[0];
}

module.exports = {
  insert: insert,
  findMatches: findMatches,
  update: update,
  findRounds: findRounds,
  deleteMatch: deleteMatch,
};
