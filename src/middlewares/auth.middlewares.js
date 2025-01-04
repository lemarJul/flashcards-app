const { Api401Error } = require("../errors/api-errors.js");
const authService = require("../services/auth.service.js");

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

module.exports = {
  user: authUser(),
  admin: authUser(ROLES.admin),
  ownResource,
};
