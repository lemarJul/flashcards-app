const { Api401Error } = require("../errors/api-errors.js");
const authService = require("../services/auth.service.js");

/**
 * Middleware function to authenticate the user then attach the user object to the request object as req.authUser.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
function authUser(req, res, next) {
  authService
    .authUser(getToken(req))
    .then((user) => {
      req.authUser = user;
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
}

/**
 * Middleware function to allow access based on user roles.
 *
 * @param {...Function} roles - The roles allowed to access the resource.
 * @returns {Function} - The middleware function.
 */
function authIf(...conditions) {
  return (req, res, next) => {
    if (conditions.some((condition) => condition(req) === true)) return next();

    next(
      new Api401Error(
        "Unauthorized: You do not have permission to access this data"
      )
    );
  };
}

function isSelf(req) {
  return req.authUser.id == req.params.id;
}

function isAdmin(req) {
  return req.authUser.role === "admin";
}

module.exports = {
  anyUser: authUser,
  self: [authUser, authIf(isSelf)],
  admin: [authUser, authIf(isAdmin)],
  selfOrAdmin: [authUser, authIf(isSelf, isAdmin)],
};
