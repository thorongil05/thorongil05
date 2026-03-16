const jwt = require("jsonwebtoken");
const logger = require("pino")();

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key-change-me";

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    logger.warn("Authentication failed: No token provided");
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      logger.warn({ err }, "Authentication failed: Invalid token");
      return res.status(401).json({ error: "Unauthorized: Invalid or expired token" });
    }
    req.user = user;
    next();
  });
}

function authorizeRole(roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!roles.includes(req.user.role)) {
      logger.warn({ user: req.user.username, role: req.user.role, required: roles }, "Authorization failed: Insufficient permissions");
      return res.status(403).json({ error: "Forbidden: Insufficient permissions" });
    }

    next();
  };
}

module.exports = {
  authenticateToken,
  authorizeRole,
};
