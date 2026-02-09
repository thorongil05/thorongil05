const pool = require("./database");
const logger = require("pino")();

async function insert(matchEntry) {
  const query = `
        INSERT INTO matches
            (match_date, competition_id, home_team_id, away_team_id, home_goals, away_goals, stadium, round)
        VALUES($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *;
    `;

  const values = [
    matchEntry.matchDate,
    matchEntry.competitionId,
    matchEntry.homeTeamId,
    matchEntry.awayTeamId,
    matchEntry.homeGoals,
    matchEntry.awayGoals,
    matchEntry.stadium,
    matchEntry.round,
  ];

  const { rows } = await pool.query(query, values);
  logger.info({ match: rows[0] }, "Match inserted");
  return rows[0];
}

async function findMatches(competitionId = null, round = null) {
  logger.info({ competitionId, round }, "Retrieving matches");
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
  
  if (competitionId) {
    values.push(competitionId);
    whereClause.push(`m.competition_id = $${values.length}`);
  }

  if (round) {
    values.push(round);
    whereClause.push(`m.round = $${values.length}`);
  }

  if (whereClause.length > 0) {
    query += " WHERE " + whereClause.join(" AND ");
  }
  
  query += " ORDER BY m.match_date DESC";

  const { rows } = await pool.query(query, values);

  const domainMatches = rows.map((row) => ({
    id: row.id,
    matchDate: row.match_date,
    competitionId: row.competition_id,
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

  logger.info({ matches: rows }, "Retrieved matches");

  return domainMatches;
}

async function findRounds(competitionId) {
  logger.info({ competitionId }, "Retrieving rounds");
  const query = `
    SELECT DISTINCT round
    FROM matches
    WHERE competition_id = $1
    ORDER BY round
  `;
  const { rows } = await pool.query(query, [competitionId]);
  return rows.map(r => r.round).filter(r => r);
}

async function update(id, match) {
  const query = `
    UPDATE matches
    SET match_date = $1, 
        competition_id = $2, 
        home_team_id = $3, 
        away_team_id = $4, 
        home_goals = $5, 
        away_goals = $6, 
        stadium = $7, 
        round = $8
    WHERE id = $9
    RETURNING *;
  `;

  const values = [
    match.matchDate,
    match.competitionId,
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

module.exports = {
  insert: insert,
  findMatches: findMatches,
  update: update,
  findRounds: findRounds,
};
