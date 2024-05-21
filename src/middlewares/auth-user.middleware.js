const { Api401Error } = require("../errors/api-errors.js");
const { authUser } = require("../services/auth.service.js");

module.exports = async (req, res, next) => {
  if (!req.headers.authorization) {
    return next(new Api401Error("No token provided"));
  }
  if (!req.body.userId) {
    return next(new Api401Error("No user ID provided"));
  }

  const token = req.headers.authorization.split(" ")[1];
  try {
    await authUser(token, req.body.userId);
    req.userId = req.body.userId;
    next();
  } catch (error) {
    return next(error);
  }
};
