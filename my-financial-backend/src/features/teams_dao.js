const pool = require("./database");

async function insert(teamEntry) {
  const query = `
        INSERT INTO teams
            (name, city)
        VALUES($1, $2)
        RETURNING *;
    `;

  const values = [teamEntry.name, teamEntry.city];

  const { rows } = await pool.query(query, values);
  console.log("Inserted rows:", rows);
  return rows[0];
}

async function retrieveAll() {
  const query = `SELECT * FROM teams;`;
  const { rows } = await pool.query(query);
  return rows;
}

module.exports = {
  insert: insert,
  retrieveAll: retrieveAll,
};
