const pool = require("./database");
const logger = require("pino")();
const UserRoles = require("../constants/roles");

async function findByEmail(email) {
  logger.info({ email }, "Finding user by email");
  const query = "SELECT * FROM users WHERE email = $1";
  const { rows } = await pool.query(query, [email]);
  return rows[0];
}

async function findByUsername(username) {
  logger.info({ username }, "Finding user by username");
  const query = "SELECT * FROM users WHERE username = $1";
  const { rows } = await pool.query(query, [username]);
  return rows[0];
}

async function insert(user) {
  logger.info({ username: user.username, email: user.email }, "Inserting new user");
  const query = `
    INSERT INTO users (username, email, password_hash, role)
    VALUES ($1, $2, $3, $4)
    RETURNING id, username, email, role, created_at;
  `;
  const values = [user.username, user.email, user.passwordHash, user.role || UserRoles.VIEWER];
  const { rows } = await pool.query(query, values);
  return rows[0];
}

module.exports = {
  findByEmail,
  findByUsername,
  insert,
};
