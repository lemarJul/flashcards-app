module.exports = ({ redisClient }) => {
  const redisClientConnection = redisClient?.getClient();

  /**
   * Implements a sliding window rate limit
   * @param {string} key - The key to track (e.g., "login:userId" or "refresh:ip")
   * @param {number} limit - Maximum number of operations allowed in the window
   * @param {number} windowInSeconds - Time window in seconds
   * @returns {Promise<{success: boolean, remaining: number, resetIn: number}>}
   */
  const checkRateLimit = async (key, limit, windowInSeconds) => {
    if (!redisClientConnection) {
      return { success: true, remaining: limit, resetIn: 0 };
    }

    const now = Date.now();
    const windowStart = now - (windowInSeconds * 1000);

    try {
      // Add the current timestamp and remove old entries
      const multi = redisClientConnection.multi();
      
      // Add current timestamp to the sorted set
      multi.zadd(key, now, now.toString());
      
      // Remove timestamps outside the window
      multi.zremrangebyscore(key, '-inf', windowStart);
      
      // Count remaining timestamps in window
      multi.zcard(key);
      
      // Set expiry on the key
      multi.expire(key, windowInSeconds);

      const [, , count] = await multi.exec();
      const remaining = Math.max(0, limit - count);
      
      if (count > limit) {
        // Get the oldest timestamp in the window
        const oldestTimestamp = await redisClientConnection.zrange(key, 0, 0);
        const resetIn = Math.ceil((parseInt(oldestTimestamp) + (windowInSeconds * 1000) - now) / 1000);
        
        return {
          success: false,
          remaining: 0,
          resetIn
        };
      }

      return {
        success: true,
        remaining,
        resetIn: windowInSeconds
      };
    } catch (error) {
      console.error('Rate limiter error:', error);
      // Fail open if Redis is unavailable
      return { success: true, remaining: limit, resetIn: 0 };
    }
  };

  /**
   * Rate limit for login attempts
   * Stricter limit per IP, more lenient per user
   */
  const loginRateLimit = async (ip, email) => {
    // Strict IP-based limit: 30 attempts per 5 minutes
    const ipLimit = await checkRateLimit(
      `ratelimit:login:ip:${ip}`,
      30,
      5 * 60
    );
    
    if (!ipLimit.success) {
      throw new Error(`IP rate limit exceeded. Try again in ${ipLimit.resetIn} seconds`);
    }

    // More lenient email-based limit: 10 attempts per minute
    if (email) {
      const emailLimit = await checkRateLimit(
        `ratelimit:login:email:${email}`,
        10,
        60
      );

      if (!emailLimit.success) {
        throw new Error(`Too many login attempts. Try again in ${emailLimit.resetIn} seconds`);
      }
    }

    return true;
  };

  /**
   * Rate limit for refresh token operations
   * Limits refresh token usage per user and per IP
   */
  const refreshTokenRateLimit = async (ip, userId) => {
    // IP-based limit: 60 refreshes per hour
    const ipLimit = await checkRateLimit(
      `ratelimit:refresh:ip:${ip}`,
      60,
      60 * 60
    );

    if (!ipLimit.success) {
      throw new Error(`IP rate limit exceeded. Try again in ${ipLimit.resetIn} seconds`);
    }

    // User-based limit: 30 refreshes per hour
    if (userId) {
      const userLimit = await checkRateLimit(
        `ratelimit:refresh:user:${userId}`,
        30,
        60 * 60
      );

      if (!userLimit.success) {
        throw new Error(`Refresh rate limit exceeded. Try again in ${userLimit.resetIn} seconds`);
      }
    }

    return true;
  };

  return {
    loginRateLimit,
    refreshTokenRateLimit
  };
};
