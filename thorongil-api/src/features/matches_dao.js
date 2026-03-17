const pool = require("./database");
const logger = require("pino")();

async function insert(matchEntry) {
  const query = `
        INSERT INTO matches
            (match_date, edition_id, phase_id, group_id, home_team_id, away_team_id, home_goals, away_goals, stadium, round, status)
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
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
    matchEntry.status || "SCHEDULED",
  ];

  const { rows } = await pool.query(query, values);
  logger.info({ match: rows[0] }, "Match inserted in Database");
  return rows[0];
}

async function bulkInsert(matchEntries) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const results = [];
    for (const matchEntry of matchEntries) {
      const query = `
        INSERT INTO matches
            (match_date, edition_id, phase_id, group_id, home_team_id, away_team_id, home_goals, away_goals, stadium, round, status)
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
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
        matchEntry.status || "SCHEDULED",
      ];
      const { rows } = await client.query(query, values);
      results.push(rows[0]);
    }
    await client.query("COMMIT");
    logger.info({ count: results.length }, "Bulk matches inserted in Database");
    return results;
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
}

function buildMatchesWhereClause(params) {
  const { round, teamId, editionId, phaseId, groupId } = params;
  const values = [];
  const whereClause = [];

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
    whereClause.push(`(m.home_team_id = $${values.length} OR m.away_team_id = $${values.length})`);
  }

  return { values, whereClause };
}

function buildMatchesOrderBy(sortBy, sortOrder) {
  const order = sortOrder?.toUpperCase() === "ASC" ? "ASC" : "DESC";
  if (sortBy === "round") {
    return ` ORDER BY LENGTH(m.round) ${order}, m.round ${order}, m.id ${order}`;
  }
  return ` ORDER BY m.match_date ${order}, m.id ${order}`;
}

function mapRowToMatch(row) {
  return {
    id: row.id,
    matchDate: row.match_date,
    editionId: row.edition_id,
    phaseId: row.phase_id,
    groupId: row.group_id,
    homeScore: row.home_goals,
    awayScore: row.away_goals,
    stadium: row.stadium,
    round: row.round,
    status: row.status,
    homeTeam: { id: row.home_team_id, name: row.home_team_name, city: row.home_team_city },
    awayTeam: { id: row.away_team_id, name: row.away_team_name, city: row.away_team_city },
  };
}

async function findMatches(args = {}) {
  logger.info({ args }, "Retrieving matches");

  let query = `
    SELECT
      m.*, ht.name as home_team_name, ht.city as home_team_city,
      at.name as away_team_name, at.city as away_team_city
    FROM matches m
    JOIN teams ht ON m.home_team_id = ht.id
    JOIN teams at ON m.away_team_id = at.id
  `;

  const { values, whereClause } = buildMatchesWhereClause(args);

  if (whereClause.length > 0) {
    query += " WHERE " + whereClause.join(" AND ");
  }

  query += buildMatchesOrderBy(args.sortBy, args.sortOrder);

  const { rows } = await pool.query(query, values);
  const domainMatches = rows.map(mapRowToMatch);

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
        round = $10,
        status = $11
    WHERE id = $12
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
    match.status || "SCHEDULED",
    id,
  ];

  const { rows } = await pool.query(query, values);
  logger.info({ match: rows[0] }, "Match updated");
  return rows[0];
}

async function getProgress(editionId) {
  const query = `
    SELECT
      COUNT(*)                                                              AS inserted,
      COUNT(*) FILTER (WHERE status IN ('COMPLETED', 'FORFEITED'))         AS completed
    FROM matches
    WHERE edition_id = $1
  `;
  const { rows } = await pool.query(query, [editionId]);
  return { inserted: Number(rows[0].inserted), completed: Number(rows[0].completed) };
}

async function deleteMatch(id) {
  const query = "DELETE FROM matches WHERE id = $1 RETURNING *;";
  const { rows } = await pool.query(query, [id]);
  logger.info({ id }, "Match deleted");
  return rows[0];
}

module.exports = {
  insert: insert,
  bulkInsert: bulkInsert,
  findMatches: findMatches,
  update: update,
  findRounds: findRounds,
  getProgress: getProgress,
  deleteMatch: deleteMatch,
};
