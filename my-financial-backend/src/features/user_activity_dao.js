const pool = require("./database");
const logger = require("pino")();
const lockManager = require("../utils/lockManager");

/**
 * Upsert user activity statistics
 * @param {number} userId - User ID
 * @param {string} sessionId - Session ID
 * @param {string} activityType - Type of activity (e.g., 'matches_added', 'matches_updated')
 * @returns {Promise<object>} Updated activity record
 */
async function upsertActivity(userId, sessionId, activityType) {
  // Create lock key from userId and sessionId
  const lockKey = `activity:${userId}:${sessionId}`;
  
  // Acquire application-level lock
  const release = await lockManager.acquire(lockKey);
  
  try {
    const query = `
      INSERT INTO user_activity (user_id, session_id, statistics, created_at, updated_at)
      VALUES ($1, $2, jsonb_build_object($3, 1), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      ON CONFLICT (user_id, session_id)
      DO UPDATE SET
        statistics = user_activity.statistics || jsonb_build_object($3, 
          COALESCE((user_activity.statistics->>$3)::int, 0) + 1
        ),
        updated_at = CURRENT_TIMESTAMP
      RETURNING *;
    `;

    const result = await pool.query(query, [userId, sessionId, activityType]);
    logger.info({ userId, sessionId, activityType }, "Activity tracked");
    return result.rows[0];
  } catch (error) {
    logger.error({ error, userId, sessionId, activityType }, "Error upserting activity");
    throw error;
  } finally {
    // Always release the lock
    release();
  }
}

/**
 * Get activity statistics for a specific user
 * @param {number} userId - User ID
 * @returns {Promise<Array>} Array of activity records
 */
async function getActivityByUser(userId) {
  const query = `
    SELECT 
      ua.id,
      ua.user_id,
      ua.session_id,
      ua.statistics,
      ua.created_at,
      ua.updated_at,
      u.username
    FROM user_activity ua
    JOIN users u ON ua.user_id = u.id
    WHERE ua.user_id = $1
    ORDER BY ua.updated_at DESC;
  `;

  try {
    const result = await pool.query(query, [userId]);
    return result.rows;
  } catch (error) {
    logger.error({ error, userId }, "Error fetching user activity");
    throw error;
  }
}

/**
 * Get aggregated activity statistics for all users
 * @returns {Promise<Array>} Array of aggregated activity records
 */
async function getAllUserActivities() {
  const query = `
    SELECT 
      ua.user_id,
      u.username,
      u.email,
      COUNT(DISTINCT ua.session_id) as session_count,
      MAX(ua.updated_at) as last_activity,
      json_agg(ua.statistics) as all_statistics
    FROM user_activity ua
    JOIN users u ON ua.user_id = u.id
    GROUP BY ua.user_id, u.username, u.email
    ORDER BY last_activity DESC;
  `;

  try {
    const result = await pool.query(query);
    
    // Sum up statistics across all sessions for each user
    const processedResults = result.rows.map(row => {
      const total_statistics = {};
      
      // Iterate through all session statistics and sum them
      if (row.all_statistics) {
        row.all_statistics.forEach(sessionStats => {
          Object.entries(sessionStats).forEach(([key, value]) => {
            total_statistics[key] = (total_statistics[key] || 0) + value;
          });
        });
      }
      
      return {
        user_id: row.user_id,
        username: row.username,
        email: row.email,
        session_count: parseInt(row.session_count),
        last_activity: row.last_activity,
        total_statistics
      };
    });

    return processedResults;
  } catch (error) {
    logger.error({ error }, "Error fetching all user activities");
    throw error;
  }
}

module.exports = {
  upsertActivity,
  getActivityByUser,
  getAllUserActivities,
};
