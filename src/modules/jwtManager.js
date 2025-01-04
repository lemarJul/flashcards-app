const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const crypto = require("crypto");

module.exports = ({ privateKey, redisClient }) => {
  const signAsync = promisify(jwt.sign);
  const verifyAsync = promisify(jwt.verify);

  const generateTokenId = () => {
    return crypto.randomBytes(32).toString("hex");
  };

  const createAccessToken = async (id) => {
    try {
      return await signAsync(
        {
          id,
          type: "access",
          jti: generateTokenId(),
        },
        privateKey,
        { expiresIn: "15m" }
      );
    } catch (error) {
      throw new Error("Access token creation failed: " + error.message, {
        cause: error,
      });
    }
  };

  const createRefreshToken = async (id) => {
    try {
      const jti = generateTokenId();
      return await signAsync(
        {
          id,
          type: "refresh",
          jti,
          family: generateTokenId(), // Token family ID to track related refresh tokens
        },
        privateKey,
        { expiresIn: "7d" }
      );
    } catch (error) {
      throw new Error("Refresh token creation failed: " + error.message, {
        cause: error,
      });
    }
  };

  const verifyToken = async (token) => {
    try {
      const decoded = await verifyAsync(token, privateKey);

      if (redisClient.connection) {
        // Check if token is blacklisted
        const isBlacklisted = await redisClient.connection.get(`bl_${token}`);
        if (isBlacklisted) {
          throw new Error("Token has been revoked");
        }

        // For refresh tokens, check if the token has been used
        if (decoded.type === "refresh") {
          const isUsed = await redisClient.connection.get(
            `used_${decoded.jti}`
          );
          if (isUsed) {
            // If token was used, invalidate entire family
            await redisClient.connection.setex(
              `family_bl_${decoded.family}`,
              7 * 24 * 60 * 60, // 7 days
              "true"
            );
            throw new Error("Refresh token reuse detected");
          }

          // Check if family is blacklisted
          const isFamilyBlacklisted = await redisClient.connection.get(
            `family_bl_${decoded.family}`
          );
          if (isFamilyBlacklisted) {
            throw new Error("Refresh token family has been revoked");
          }
        }
      }

      return decoded;
    } catch (error) {
      throw new Error("JWT Verification Failed: " + error.message, {
        cause: error,
      });
    }
  };

  const revokeToken = async (token) => {
    try {
      // Verify token first to get expiration
      const decoded = await verifyAsync(token, privateKey);

      // Calculate TTL (time until token expires)
      const exp = decoded.exp;
      const now = Math.floor(Date.now() / 1000);
      const ttl = exp - now;

      if (ttl > 0 && redisClient.connection) {
        // Add token to blacklist with TTL
        await redisClient.connection.setex(`bl_${token}`, ttl, "true");

        // If it's a refresh token, blacklist the entire family
        if (decoded.type === "refresh") {
          await redisClient.connection.setex(
            `family_bl_${decoded.family}`,
            7 * 24 * 60 * 60, // 7 days
            "true"
          );
        }
      }

      return true;
    } catch (error) {
      throw new Error("Token revocation failed: " + error.message, {
        cause: error,
      });
    }
  };

  const markRefreshTokenAsUsed = async (token) => {
    try {
      if (!redisClient.connection) return;

      const decoded = await verifyAsync(token, privateKey);
      if (decoded.type !== "refresh") {
        throw new Error("Not a refresh token");
      }

      // Mark token as used
      await redisClient.connection.setex(
        `used_${decoded.jti}`,
        7 * 24 * 60 * 60, // 7 days
        "true"
      );

      return decoded;
    } catch (error) {
      throw new Error(
        "Failed to mark refresh token as used: " + error.message,
        { cause: error }
      );
    }
  };

  return {
    createAccessToken,
    createRefreshToken,
    verifyToken,
    revokeToken,
    markRefreshTokenAsUsed,
  };
};
