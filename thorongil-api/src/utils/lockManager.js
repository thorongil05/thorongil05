/**
 * Simple in-memory lock manager for application-level locking
 */
class LockManager {
  constructor() {
    this.locks = new Map();
    this.queues = new Map();
  }

  /**
   * Acquire a lock for a given key
   * @param {string} key - Lock key
   * @returns {Promise<Function>} Release function
   */
  async acquire(key) {
    // If lock exists, wait in queue
    if (this.locks.has(key)) {
      await new Promise((resolve) => {
        if (!this.queues.has(key)) {
          this.queues.set(key, []);
        }
        this.queues.get(key).push(resolve);
      });
    }

    // Acquire lock
    this.locks.set(key, true);

    // Return release function
    return () => this.release(key);
  }

  /**
   * Release a lock
   * @param {string} key - Lock key
   */
  release(key) {
    this.locks.delete(key);

    // Process queue
    const queue = this.queues.get(key);
    if (queue && queue.length > 0) {
      const next = queue.shift();
      next();
    } else {
      this.queues.delete(key);
    }
  }

  /**
   * Try to acquire lock without waiting
   * @param {string} key - Lock key
   * @returns {Function|null} Release function or null if lock not available
   */
  tryAcquire(key) {
    if (this.locks.has(key)) {
      return null;
    }

    this.locks.set(key, true);
    return () => this.release(key);
  }
}

// Singleton instance
const lockManager = new LockManager();

module.exports = lockManager;
