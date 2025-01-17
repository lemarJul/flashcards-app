const { Api401Error, Api429Error } = require("../errors/api-errors.js");
const authService = require("../services/auth.service.js");
const { redisClient } = require("../db");
const RateLimiter = require("../modules/rateLimiter.js")({ redisClient });
const { config } = require("dotenv");
const rateLimitConfig = require("config").get("rateLimit");
const ROLES = Object.freeze({ admin: "admin" });

/**
 * Middleware function to authenticate the user then attach the user object to the request object as req.authUser.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const authUser =
  (role = "user") =>
  (req, res, next) => {
    authService
      .authUser(getToken(req))
      .then((user) => {
        req.user = user;
        checkRole(user, role);
        next();
      })
      .catch((error) => {
        next(error);
      });

    function getToken() {
      if (!req.headers.authorization) {
        return next(new Api401Error("No token provided"));
      }
      return req.headers.authorization.split(" ")[1];
    }
  };

const ownResource = (rsc) => (req, res, next) => {
  if (req.user && req.user.id !== req[rsc].userId)
    next(new Api401Error("Not allowed"));
  next();
};

/**
 * Middleware function to allow access based on user roles.
 *
 * @param {...Function} roles - The roles allowed to access the resource.
 * @returns {Function} - The middleware function.
 */
function checkRole(user, role) {
  if (user.role !== role)
    throw new Api401Error(
      "Unauthorized: You do not have permission to access this data"
    );
}

/**
 * Revoke a JWT token, marking it as invalid.
 *
 * @param {string} token - The JWT token to revoke.
 */
function revokeJWT(token) {
  // Load the JWKS (JSON Web Key Set) for the issuer from your key storage
  const jwks = loadJWKS();

  // Validate the input token
  if (!token || !isString(token)) {
    throw new Error("Invalid JWT token");
  }

  // Get the kid (key ID) from the token header
  const { kid } = getHeaderFromToken(token);

  // Find the matching key in the JWKS for this kid
  const key = jwks.keys.find((k) => k.kid === kid);

  if (!key) {
    throw new Error(`No key found for JWT token with kid ${kid}`);
  }

  // Verify the signature of the token using the loaded key
  const decodedToken = verifyToken(token, key.n, key.e);

  if (decodedToken.error) {
    throw decodedToken.error;
  }

  // Update your storage to mark this token as revoked
  updateRevokedTokens(decodedToken.payload.sub);
}

//* ////////////////////////////////////////////////////////////////////////
//* LIMITERS
//* ////////////////////////////////////////////////////////////////////////

// async function limit(req, res, next) {
//   const limiter = new RateLimiter(req.path, configs);
//   try {
//     await limiter.checkRateLimit("ip", req.ip);
//     if (req.body.email) await limiter.checkRateLimit("email", req.body.email);
//     if (req.body.userId)
//       await limiter.checkRateLimit("userId", req.body.userId);
//     // add more checks here as needed
//     next();
//   } catch (error) {
//     if (error.message.includes("rate limit exceeded")) {
//       next(new Api429Error(error.message));
//     } else {
//       next(error);
//     }
//   }
// }

async function loginLimiter(req, res, next) {
  const limiter = new RateLimiter("login", rateLimitConfig.login);
  try {
    await limiter.checkRateLimit("ip", req.ip);
    if (req.body.email) await limiter.checkRateLimit("email", req.body.email);
    // add more checks here as needed
    next();
  } catch (error) {
    if (error.message.includes("rate limit exceeded")) {
      next(new Api429Error(error.message));
    } else {
      next(error);
    }
  }
}

async function refreshTokenLimiter(req, res, next) {
  const { checkRateLimit: checkLimit } = new RateLimiter(
    "refresh",
    rateLimitConfig.refreshToken
  );
  try {
    await checkLimit("ip", req.ip);
    if (req.body.userId) await checkLimit("userId", req.body.userId);
    // add more checks here as needed
    next();
  } catch (error) {
    if (error.message.includes("rate limit exceeded")) {
      next(new Api429Error(error.message));
    } else {
      next(error);
    }
  }
}

module.exports = {
  user: authUser(),
  admin: authUser(ROLES.admin),
  ownResource,
  limiters: {
    loginLimiter,
    refreshTokenLimiter,
  },
};
