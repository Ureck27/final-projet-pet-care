const Redis = require('ioredis');

const isTest = process.env.NODE_ENV === 'test';
const isRedisDisabled = process.env.REDIS_ENABLED !== 'true';
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

// Mock Redis when disabled or in tests to prevent hanging connections
const redis =
  isTest || isRedisDisabled
    ? {
        on: () => {},
        get: async () => null,
        set: async () => {},
        del: async () => {},
        keys: async () => [],
      }
    : new Redis(redisUrl, {
        maxRetriesPerRequest: null,
        retryStrategy: (times) => {
          // We now keep retrying indefinitely with a cap
          return Math.min(times * 1000, 10000);
        },
      });

if (!isTest && !isRedisDisabled) {
  redis.on('connect', () => console.log('✓ Redis Connected'));
  redis.on('error', (err) => console.warn('⚠ Redis Connection Error:', err.message));
} else if (isRedisDisabled) {
  console.log('ℹ Redis disabled. Cache service running in mock mode.');
}

/**
 * Cache service for frequently accessed data
 */
const cacheService = {
  /**
   * Get value from cache
   * @param {string} key
   * @returns {Promise<any>}
   */
  async get(key) {
    try {
      const data = await redis.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`Cache GET error for key ${key}:`, error);
      return null;
    }
  },

  /**
   * Set value in cache with TTL
   * @param {string} key
   * @param {any} value
   * @param {number} ttl - Time to live in seconds (default: 3600)
   */
  async set(key, value, ttl = process.env.CACHE_TTL || 3600) {
    try {
      await redis.set(key, JSON.stringify(value), 'EX', ttl);
    } catch (error) {
      console.error(`Cache SET error for key ${key}:`, error);
    }
  },

  /**
   * Delete value from cache
   * @param {string} key
   */
  async del(key) {
    try {
      await redis.del(key);
    } catch (error) {
      console.error(`Cache DEL error for key ${key}:`, error);
    }
  },

  /**
   * Delete values matching a pattern
   * @param {string} pattern
   */
  async delPattern(pattern) {
    try {
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } catch (error) {
      console.error(`Cache delPattern error for pattern ${pattern}:`, error);
    }
  },

  /**
   * Middleware to cache responses
   * @param {string} keyPrefix - Prefix for the cache key
   * @param {number} ttl - TTL in seconds
   */
  cacheMiddleware(keyPrefix, ttl) {
    return async (req, res, next) => {
      if (process.env.NODE_ENV === 'test') return next();

      const key = `${keyPrefix}:${req.originalUrl || req.url}`;
      const cachedData = await cacheService.get(key);

      if (cachedData) {
        return res.json(cachedData);
      }

      // Override res.json to cache the result
      const originalJson = res.json;
      res.json = function (data) {
        cacheService.set(key, data, ttl);
        return originalJson.call(this, data);
      };

      next();
    };
  },
};

module.exports = cacheService;
