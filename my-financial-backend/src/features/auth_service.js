const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authDao = require("./auth_dao");
const UserRoles = require("../constants/roles");
const logger = require("pino")();

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key-change-me";
const SALT_ROUNDS = 10;

async function register(username, email, password) {
  // Check if user exists
  const existingEmail = await authDao.findByEmail(email);
  if (existingEmail) {
    throw new Error("Email already in use");
  }

  const existingUsername = await authDao.findByUsername(username);
  if (existingUsername) {
    throw new Error("Username already taken");
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  // Save user
  const newUser = await authDao.insert({
    username,
    email,
    passwordHash,
    role: UserRoles.VIEWER, // Default to viewer
  });

  return newUser;
}

async function login(email, password) {
  const user = await authDao.findByEmail(email);
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password_hash);
  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }

  // Generate JWT
  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: "24h" }
  );

  return {
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
    token,
  };
}

async function getAllUsers() {
  return await authDao.findAll();
}

async function updateRole(id, role) {
  return await authDao.updateRole(id, role);
}

async function deleteUser(id) {
  return await authDao.deleteUser(id);
}

module.exports = {
  register,
  login,
  getAllUsers,
  updateRole,
  deleteUser,
};
