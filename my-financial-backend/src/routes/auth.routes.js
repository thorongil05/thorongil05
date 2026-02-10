const express = require("express");
const router = express.Router();
const authService = require("../features/auth_service");
const logger = require("pino")();

router.post("/register", async (req, res) => {
  try {
    response.appendHeader("Access-Control-Allow-Origin", "http://localhost:5173");
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const user = await authService.register(username, email, password);
    res.status(201).json(user);
  } catch (err) {
    logger.error({ err: err.message }, "Registration error");
    res.status(400).json({ error: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    response.appendHeader("Access-Control-Allow-Origin", "http://localhost:5173");
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Missing email or password" });
    }
    const result = await authService.login(email, password);
    res.json(result);
  } catch (err) {
    logger.error({ err: err.message }, "Login error");
    res.status(401).json({ error: err.message });
  }
});

router.options("/", (req, res) => {
  response.set({
    Allow: "GET, POST, OPTIONS",
    "Access-Control-Allow-Origin": "http://localhost:5173",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400", // 24 hours
  });
  response.status(200).send();
});

module.exports = router;