const pool = require("./database");

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

module.exports = {
  insert: insert,
  retrieveAll: retrieveAll,
};
