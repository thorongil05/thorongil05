const pool = require("./database");

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
  console.log("Inserted match:", rows[0]);
  return rows[0];
}

async function retrieveAll() {
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
  return rows;
}

module.exports = {
  insert: insert,
  retrieveAll: retrieveAll,
};
