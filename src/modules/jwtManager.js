const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const crypto = require("crypto");

module.exports = ({ privateKey, redisClient }) => {
  const signAsync = promisify(jwt.sign);
  const verifyAsync = promisify(jwt.verify);
  let redisClientConnection = null;

  if (redisClient) {
    redisClientConnection = redisClient.getClient();
  }

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
      throw new Error("Access token creation failed: " + error.message, { cause: error });
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
      throw new Error("Refresh token creation failed: " + error.message, { cause: error });
    }
  };

  const verifyToken = async (token) => {
    try {
      const decoded = await verifyAsync(token, privateKey);

      if (redisClientConnection) {
        // Check if token is blacklisted
        const isBlacklisted = await redisClientConnection.get(`bl_${token}`);
        if (isBlacklisted) {
          throw new Error("Token has been revoked");
        }

        // For refresh tokens, check if the token has been used
        if (decoded.type === "refresh") {
          const isUsed = await redisClientConnection.get(`used_${decoded.jti}`);
          if (isUsed) {
            // If token was used, invalidate entire family
            await redisClientConnection.setex(
              `family_bl_${decoded.family}`,
              7 * 24 * 60 * 60, // 7 days
              "true"
            );
            throw new Error("Refresh token reuse detected");
          }

          // Check if family is blacklisted
          const isFamilyBlacklisted = await redisClientConnection.get(
            `family_bl_${decoded.family}`
          );
          if (isFamilyBlacklisted) {
            throw new Error("Refresh token family has been revoked");
          }
        }
      }

      return decoded;
    } catch (error) {
      throw new Error("JWT Verification Failed: " + error.message, { cause: error });
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

      if (ttl > 0 && redisClientConnection) {
        // Add token to blacklist with TTL
        await redisClientConnection.setex(`bl_${token}`, ttl, "true");

        // If it's a refresh token, blacklist the entire family
        if (decoded.type === "refresh") {
          await redisClientConnection.setex(
            `family_bl_${decoded.family}`,
            7 * 24 * 60 * 60, // 7 days
            "true"
          );
        }
      }

      return true;
    } catch (error) {
      throw new Error("Token revocation failed: " + error.message, { cause: error });
    }
  };

  const markRefreshTokenAsUsed = async (token) => {
    try {
      if (!redisClientConnection) return;

      const decoded = await verifyAsync(token, privateKey);
      if (decoded.type !== "refresh") {
        throw new Error("Not a refresh token");
      }

      // Mark token as used
      await redisClientConnection.setex(
        `used_${decoded.jti}`,
        7 * 24 * 60 * 60, // 7 days
        "true"
      );

      return decoded;
    } catch (error) {
      throw new Error("Failed to mark refresh token as used: " + error.message, { cause: error });
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
