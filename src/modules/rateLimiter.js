module.exports = ({ redisClient }) =>
  class RateLimiter {
    #keyPrefix = "rateLimit:";
    #route;
    #normalizedConfigs;

    /**
     * Creates a new rate limiter instance
     * @param {string} route - The route to rate limit
     * @param {Array<{identifierType: string, limit: number, windowInSeconds: number}>} configs - Rate limit configurations
     * @throws {Error} If configs are invalid
     */
    constructor(route, configs) {
      if (!Array.isArray(configs) || configs.length === 0) {
        throw new Error("Rate limit configs must be a non-empty array");
      }

      this.#route = route;
      // Pre-normalize configs for faster lookup
      this.#normalizedConfigs = new Map(
        configs.map((config) => [config.identifierType.toLowerCase(), config])
      );
    }

    /**
     * Checks if the rate limit is exceeded for a given identifier.
     * @param {string} identifierType - The type of identifier (e.g., 'ip', 'user').
     * @param {string} identifierValue - The value of the identifier (e.g., '192.168.1.1', 'user123').
     * @throws {Error} If the rate limit is exceeded.  The error message includes the route, identifier type, identifier value, and time until reset.
     */
    async checkRateLimit(identifierType, identifierValue) {
      const config = this.#getIdentifierConfig(identifierType);
      const key = this.#getIdentifierKey(identifierType, identifierValue);

      const result = await this.#checkRateLimit(
        key,
        config.limit,
        config.windowInSeconds
      );

      if (!result.success) {
        throw new Error(
          `${
            this.#route
          } rate limit exceeded for ${identifierType}: ${identifierValue}. Try again in ${
            result.resetIn
          } seconds`
        );
      }
    }

    /**
     * Gets the rate limit configuration for a given identifier type
     * @private
     * @param {string} identifierType - The type of identifier
     * @returns {Object} The rate limit configuration
     * @throws {Error} If no configuration exists for the identifier type
     */
    #getIdentifierConfig(identifierType) {
      const config = this.#normalizedConfigs.get(identifierType.toLowerCase());

      if (!config) {
        throw new Error(
          `No rate limit config found for identifier type: ${identifierType}`
        );
      }

      return config;
    }

    /**
     * Generates a Redis key for rate limiting
     * @private
     * @param {string} identifierType - The type of identifier
     * @param {string} identifierValue - The value of the identifier
     * @returns {string} The Redis key
     */
    #getIdentifierKey(identifierType, identifierValue) {
      // Avoid array creation and multiple toLowerCase calls
      return `${this.#keyPrefix}${
        this.#route
      }:${identifierType}:${identifierValue}`.toLowerCase();
    }

    /**
     * Checks rate limit for a given key
     * @private
     * @param {string} key - Redis key
     * @param {number} requestLimit - Maximum requests allowed
     * @param {number} windowInSeconds - Time window in seconds
     * @returns {Promise<{success: boolean, remaining: number, resetIn: number}>}
     */
    async #checkRateLimit(key, requestLimit, windowInSeconds) {
      try {
        if (!redisClient?.connection) {
          console.warn("Redis client unavailable - rate limiting disabled");
          // Maintain fail-open behavior for high availability
          return { success: true, remaining: requestLimit, resetIn: 0 };
        }

        const now = Date.now();
        const windowStart = now - windowInSeconds * 1000;

        // Execute the Redis multi command and extract the count of remaining timestamps.  The result of .exec() is an array,
        // where the third element ([, , count]) contains the count of elements returned by zcard.  We use destructuring
        // to get only the count value, ignoring the results of zadd and zremrangebyscore.
        // Pipeline Redis commands in a single round-trip for efficiency
        const [[,], [,], [, requestCount], [, oldestTimestamp]] =
          await redisClient.connection
            .multi()
            .zadd(key, now, now.toString())
            .zremrangebyscore(key, "-inf", windowStart)
            .zcard(key)
            .zrange(key, 0, 0)
            .expire(key, windowInSeconds)
            .exec();

        const success = requestCount <= requestLimit;
        const remaining = success
          ? Math.max(0, requestLimit - requestCount)
          : 0;
        const resetIn = success
          ? 0
          : this.#calculateResetTime(oldestTimestamp, windowInSeconds, now);

        return { success, resetIn, remaining };
      } catch (error) {
        console.error(`Rate limiter error for key ${key}:`, error);
        // Maintain fail-open behavior for resilience
        return { success: true, remaining: requestLimit, resetIn: 0 };
      }
    }

    /**
     * Calculates time until rate limit reset
     * @private
     * @param {string} oldestTimestamp - Oldest request timestamp
     * @param {number} windowInSeconds - Time window in seconds
     * @param {number} now - Current timestamp
     * @returns {number} Seconds until reset
     */
    #calculateResetTime(oldestTimestamp, windowInSeconds, now) {
      if (!oldestTimestamp) return windowInSeconds;
      const resetTime = Math.ceil(
        (parseInt(oldestTimestamp) + windowInSeconds * 1000 - now) / 1000
      );
      return Math.max(0, resetTime); // Ensure non-negative
    }
  };
