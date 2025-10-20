const Redis = require('ioredis');
const config = require('../config');
const logger = require('../utils/logger');

/**
 * CacheService
 *
 * Thin wrapper around Redis providing JSON-safe get/set and common helpers
 * used by AfriVerse for query caching, atoms caching and validation states.
 *
 * Configuration is loaded from `src/config/index.js` (e.g., `config.redis.url`).
 */
class CacheService {
  constructor() {
    this.redis = new Redis(config.redis.url, config.redis.options);
    this.defaultTTL = 3600; // 1 hour
    
    this.redis.on('error', (error) => {
      logger.error('Redis connection error:', error);
    });
    
    this.redis.on('connect', () => {
      logger.info('Redis connected successfully');
    });
  }

  /**
   * Get a value by key and JSON-deserialize it.
   * @param {string} key
   * @returns {Promise<any|null>}
   */
  async get(key) {
    try {
      const value = await this.redis.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      logger.error('Cache get error:', error);
      return null;
    }
  }

  /**
   * Set a value by key with optional TTL; value is JSON-serialized.
   * @param {string} key
   * @param {any} value
   * @param {number} [ttl=this.defaultTTL] - seconds; 0 or negative disables TTL
   * @returns {Promise<boolean>}
   */
  async set(key, value, ttl = this.defaultTTL) {
    try {
      const serializedValue = JSON.stringify(value);
      if (ttl > 0) {
        await this.redis.setex(key, ttl, serializedValue);
      } else {
        await this.redis.set(key, serializedValue);
      }
      return true;
    } catch (error) {
      logger.error('Cache set error:', error);
      return false;
    }
  }

  /**
   * Delete a key.
   * @param {string} key
   * @returns {Promise<boolean>}
   */
  async del(key) {
    try {
      await this.redis.del(key);
      return true;
    } catch (error) {
      logger.error('Cache delete error:', error);
      return false;
    }
  }

  /**
   * Check if a key exists.
   * @param {string} key
   * @returns {Promise<boolean>}
   */
  async exists(key) {
    try {
      const result = await this.redis.exists(key);
      return result === 1;
    } catch (error) {
      logger.error('Cache exists error:', error);
      return false;
    }
  }

  /**
   * Health check for Redis connectivity.
   * @returns {Promise<{status: 'healthy'|'unhealthy', message: string}>}
   */
  async health() {
    try {
      await this.redis.ping();
      return { status: 'healthy', message: 'Redis is responding' };
    } catch (error) {
      return { status: 'unhealthy', message: error.message };
    }
  }

  // Cache-specific methods for AfriVerse
  /**
   * Cache a query result with a normalized key derived from the query payload.
   * @param {object} query
   * @param {any} result
   * @param {number} [ttl=1800]
   */
  async cacheQueryResult(query, result, ttl = 1800) {
    const key = `query:${this.hashQuery(query)}`;
    return await this.set(key, {
      result,
      timestamp: Date.now(),
      query
    }, ttl);
  }

  /**
   * Retrieve a cached query result if still fresh.
   * @param {object} query
   * @returns {Promise<any|null>}
   */
  async getCachedQuery(query) {
    const key = `query:${this.hashQuery(query)}`;
    const cached = await this.get(key);
    
    if (cached && Date.now() - cached.timestamp < 1800000) { // 30 minutes
      return cached.result;
    }
    
    return null;
  }

  /**
   * Cache MeTTa atoms for an entry.
   * @param {number|string} entryId
   * @param {any[]} atoms
   * @param {number} [ttl=86400]
   */
  async cacheAtoms(entryId, atoms, ttl = 86400) {
    const key = `atoms:${entryId}`;
    return await this.set(key, {
      atoms,
      timestamp: Date.now()
    }, ttl);
  }

  /**
   * Retrieve cached atoms for an entry.
   * @param {number|string} entryId
   * @returns {Promise<any[]|null>}
   */
  async getCachedAtoms(entryId) {
    const key = `atoms:${entryId}`;
    const cached = await this.get(key);
    return cached ? cached.atoms : null;
  }

  /**
   * Cache validation metadata for an entry.
   * @param {number|string} entryId
   * @param {object} validation
   * @param {number} [ttl=3600]
   */
  async cacheValidation(entryId, validation, ttl = 3600) {
    const key = `validation:${entryId}`;
    return await this.set(key, validation, ttl);
  }

  /**
   * Retrieve cached validation metadata for an entry.
   * @param {number|string} entryId
   * @returns {Promise<object|null>}
   */
  async getCachedValidation(entryId) {
    const key = `validation:${entryId}`;
    return await this.get(key);
  }

  async incrementSubmissionCount(community) {
    const key = `stats:submissions:${community}:${this.getCurrentHour()}`;
    return await this.incr(key);
  }

  async getSubmissionStats(community) {
    const key = `stats:submissions:${community}:${this.getCurrentHour()}`;
    return await this.get(key) || 0;
  }

  // Utility methods
  hashQuery(query) {
    const crypto = require('crypto');
    return crypto.createHash('md5').update(JSON.stringify(query)).digest('hex');
  }

  getCurrentHour() {
    const now = new Date();
    return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}-${now.getHours()}`;
  }

  // Close connection
  async disconnect() {
    try {
      await this.redis.quit();
      logger.info('Redis connection closed');
    } catch (error) {
      logger.error('Error closing Redis connection:', error);
    }
  }
}

module.exports = new CacheService();