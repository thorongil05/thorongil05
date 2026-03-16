const pool = require("./database");
const logger = require("pino")();
const UserRoles = require("../constants/roles");

async function findByEmail(email) {
  logger.info({ email }, "Finding user by email");
  const query = "SELECT * FROM users WHERE email = $1";
  const { rows } = await pool.query(query, [email]);
  return rows[0];
}

async function findAll() {
  logger.info("Retrieving all users");
  const query = "SELECT id, username, email, role, created_at FROM users ORDER BY created_at DESC";
  const { rows } = await pool.query(query);
  return rows;
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

async function updateRole(id, role) {
  logger.info({ id, role }, "Updating user role");
  const query = "UPDATE users SET role = $1 WHERE id = $2 RETURNING id, username, email, role, created_at";
  const { rows } = await pool.query(query, [role, id]);
  return rows[0];
}

async function deleteUser(id) {
  logger.info({ id }, "Deleting user");
  const query = "DELETE FROM users WHERE id = $1 RETURNING id, username, email";
  const { rows } = await pool.query(query, [id]);
  return rows[0];
}

module.exports = {
  findByEmail,
  findByUsername,
  findAll,
  insert,
  updateRole,
  deleteUser,
};
