const Redis = require('ioredis');
const config = require('../config');
const logger = require('../utils/logger');

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

  async get(key) {
    try {
      const value = await this.redis.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      logger.error('Cache get error:', error);
      return null;
    }
  }

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

  async del(key) {
    try {
      await this.redis.del(key);
      return true;
    } catch (error) {
      logger.error('Cache delete error:', error);
      return false;
    }
  }

  async exists(key) {
    try {
      const result = await this.redis.exists(key);
      return result === 1;
    } catch (error) {
      logger.error('Cache exists error:', error);
      return false;
    }
  }

  async incr(key) {
    try {
      return await this.redis.incr(key);
    } catch (error) {
      logger.error('Cache increment error:', error);
      return null;
    }
  }

  async decr(key) {
    try {
      return await this.redis.decr(key);
    } catch (error) {
      logger.error('Cache decrement error:', error);
      return null;
    }
  }

  async hset(key, field, value) {
    try {
      const serializedValue = JSON.stringify(value);
      await this.redis.hset(key, field, serializedValue);
      return true;
    } catch (error) {
      logger.error('Cache hset error:', error);
      return false;
    }
  }

  async hget(key, field) {
    try {
      const value = await this.redis.hget(key, field);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      logger.error('Cache hget error:', error);
      return null;
    }
  }

  async hgetall(key) {
    try {
      const values = await this.redis.hgetall(key);
      const result = {};
      
      for (const [field, value] of Object.entries(values)) {
        result[field] = JSON.parse(value);
      }
      
      return result;
    } catch (error) {
      logger.error('Cache hgetall error:', error);
      return {};
    }
  }

  async expire(key, ttl) {
    try {
      await this.redis.expire(key, ttl);
      return true;
    } catch (error) {
      logger.error('Cache expire error:', error);
      return false;
    }
  }

  async ttl(key) {
    try {
      return await this.redis.ttl(key);
    } catch (error) {
      logger.error('Cache TTL error:', error);
      return -2; // Key doesn't exist
    }
  }

  async keys(pattern) {
    try {
      return await this.redis.keys(pattern);
    } catch (error) {
      logger.error('Cache keys error:', error);
      return [];
    }
  }

  async flush() {
    try {
      await this.redis.flushdb();
      return true;
    } catch (error) {
      logger.error('Cache flush error:', error);
      return false;
    }
  }

  async health() {
    try {
      await this.redis.ping();
      return { status: 'healthy', message: 'Redis is responding' };
    } catch (error) {
      return { status: 'unhealthy', message: error.message };
    }
  }

  // Cache-specific methods for AfriVerse
  async cacheQueryResult(query, result, ttl = 1800) {
    const key = `query:${this.hashQuery(query)}`;
    return await this.set(key, {
      result,
      timestamp: Date.now(),
      query
    }, ttl);
  }

  async getCachedQuery(query) {
    const key = `query:${this.hashQuery(query)}`;
    const cached = await this.get(key);
    
    if (cached && Date.now() - cached.timestamp < 1800000) { // 30 minutes
      return cached.result;
    }
    
    return null;
  }

  async cacheAtoms(entryId, atoms, ttl = 86400) {
    const key = `atoms:${entryId}`;
    return await this.set(key, {
      atoms,
      timestamp: Date.now()
    }, ttl);
  }

  async getCachedAtoms(entryId) {
    const key = `atoms:${entryId}`;
    const cached = await this.get(key);
    return cached ? cached.atoms : null;
  }

  async cacheValidation(entryId, validation, ttl = 3600) {
    const key = `validation:${entryId}`;
    return await this.set(key, validation, ttl);
  }

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