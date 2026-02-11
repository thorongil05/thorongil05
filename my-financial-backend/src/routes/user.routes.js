const express = require("express");
const router = express.Router();
const authService = require("../features/auth_service");
const { authenticateToken, authorizeRole } = require("../middleware/auth.middleware");
const UserRoles = require("../constants/roles");

router.get("/", authenticateToken, authorizeRole([UserRoles.ADMIN]), async (req, res) => {
  try {
    const users = await authService.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
