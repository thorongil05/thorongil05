const pool = require("./database");
const logger = require("pino")();

async function insert(matchEntry) {
  const query = `
        INSERT INTO matches
            (match_date, competition_id, home_team_id, away_team_id, home_goals, away_goals, stadium)
        VALUES($1, $2, $3, $4, $5, $6, $7)
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
  ];

  const { rows } = await pool.query(query, values);
  logger.info({ match: rows[0] }, "Match inserted");
  return rows[0];
}

async function retrieveAll() {
  logger.info("Retrieving all matches");
  const query = `
    SELECT
      m.*,
      ht.name as home_team_name,
      ht.city as home_team_city,
      at.name as away_team_name,
      at.city as away_team_city
    FROM matches m
    JOIN teams ht ON m.home_team_id = ht.id
    JOIN teams at ON m.away_team_id = at.id;
  `;
  const { rows } = await pool.query(query);

  const domainMatches = rows.map((row) => ({
    id: row.id,
    matchDate: row.match_date,
    competitionId: row.competition_id,
    homeScore: row.home_goals,
    awayScore: row.away_goals,
    stadium: row.stadium,
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

module.exports = {
  insert: insert,
  retrieveAll: retrieveAll,
};
