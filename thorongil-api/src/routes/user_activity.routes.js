const express = require("express");
const router = express.Router();
const logger = require("pino")();
const userActivityDao = require("../features/user_activity_dao");
const { authenticateToken, authorizeRole } = require("../middleware/auth.middleware");
const UserRoles = require("../constants/roles");

/**
 * GET /api/user-activity
 * Get all user activities (admin only)
 */
router.get("/", authenticateToken, authorizeRole([UserRoles.ADMIN]), async (req, res) => {
  logger.info("User activity endpoint, received GET request");
  
  try {
    const activities = await userActivityDao.getAllUserActivities();
    res.status(200).send(activities);
  } catch (error) {
    logger.error({ error }, "Error fetching user activities");
    res.status(500).send({ error: "Failed to fetch user activities" });
  }
});

/**
 * GET /api/user-activity/:userId
 * Get activity for a specific user (admin only)
 */
router.get("/:userId", authenticateToken, authorizeRole([UserRoles.ADMIN]), async (req, res) => {
  const userId = parseInt(req.params.userId);
  
  if (isNaN(userId)) {
    return res.status(400).send({ error: "Invalid user ID" });
  }

  logger.info({ userId }, "User activity endpoint, received GET request for specific user");
  
  try {
    const activities = await userActivityDao.getActivityByUser(userId);
    res.status(200).send(activities);
  } catch (error) {
    logger.error({ error, userId }, "Error fetching user activity");
    res.status(500).send({ error: "Failed to fetch user activity" });
  }
});

module.exports = router;
