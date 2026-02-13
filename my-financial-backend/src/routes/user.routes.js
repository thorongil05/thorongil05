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

router.patch("/:id", authenticateToken, authorizeRole([UserRoles.ADMIN]), async (req, res) => {
  try {
    const { id } = req.params;
    const { role, ...rest } = req.body;

    // Check if other fields are present
    if (Object.keys(rest).length > 0) {
      return res.status(400).json({ error: "Not yet defined: only role modification is allowed" });
    }

    if (!role) {
      return res.status(400).json({ error: "Role is required" });
    }

    // Restriction: Cannot promote to ADMIN
    if (role === UserRoles.ADMIN) {
      return res.status(403).json({ error: "Promotion to ADMIN is not allowed" });
    }

    // Restriction: Cannot change own role
    if (Number(id) === req.user.id) {
      return res.status(403).json({ error: "You cannot change your own role" });
    }

    const updatedUser = await authService.updateRole(id, role);
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", authenticateToken, authorizeRole([UserRoles.ADMIN]), async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await authService.deleteUser(id);
    res.json(deletedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
