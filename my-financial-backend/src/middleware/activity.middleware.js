const userActivityDao = require("../features/user_activity_dao");
const logger = require("pino")();
const crypto = require("crypto");

/**
 * Middleware to track user activity
 * This should be applied after authenticateToken middleware
 */
function trackActivity(activityType) {
  return async (req, res, next) => {
    // Store original res.send to intercept successful responses
    const originalSend = res.send.bind(res);

    res.send = function (data) {
      // Only track if the response was successful (2xx status)
      if (res.statusCode >= 200 && res.statusCode < 300) {
        // Track activity asynchronously (don't block the response)
        if (req.user && req.user.id) {
          const userId = req.user.id;
          // Generate or retrieve session ID from request
          // For simplicity, we'll use a combination of user ID and a hash of the user agent
          const sessionId = req.headers['x-session-id'] || 
            crypto.createHash('md5')
              .update(`${userId}-${req.headers['user-agent'] || 'unknown'}`)
              .digest('hex');

          logger.info({ userId, sessionId, activityType }, "Tracking activity");

          userActivityDao.upsertActivity(userId, sessionId, activityType)
            .catch(error => {
              logger.error({ error, userId, activityType }, "Failed to track activity");
            });
        }
      }

      // Call original send method
      return originalSend(data);
    };

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
