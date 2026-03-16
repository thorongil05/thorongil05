const userActivityDao = require("../features/user_activity_dao");
const logger = require("pino")();
const crypto = require("crypto");

/**
 * Middleware to track user activity
 * This should be applied after authenticateToken middleware
 */
function trackActivity(activityType) {
  return (req, res, next) => {

    res.on("finish", () => {
      logger.info({ originalUrl: req.originalUrl, method: req.method }, "Response finished - Tracking activity");
      if (res.statusCode >= 200 && res.statusCode < 300) {
        if (req.user?.id) {
          const userId = req.user.id;

          const sessionId =
            req.headers['x-session-id'] ||
            crypto.createHash('md5')
              .update(`${userId}-${req.headers['user-agent'] || 'unknown'}`)
              .digest('hex');

          userActivityDao.upsertActivity(userId, sessionId, activityType)
            .catch(error => {
              logger.error({ error }, "Failed to track activity");
            });
        }
      }
    });

    next();
  };
}

/**
 * Helper to determine activity type from route and method
 */
function getActivityType(method, resource) {
  const methodMap = {
    POST: 'added',
    PUT: 'updated',
    PATCH: 'updated',
    DELETE: 'deleted',
  };

  const action = methodMap[method] || 'accessed';
  return `${resource}_${action}`;
}

module.exports = {
  trackActivity,
  getActivityType,
};
