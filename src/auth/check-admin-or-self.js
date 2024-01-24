const { User } = require("../db");
const { Api403Error } = require("../errors/api-errors");

module.exports = async function checkAdminOrSelf(req, res, next) {
  const isSelf = req.userId && req.userId == req.params.id
  const isAdmin = req.userId && (await User.findByPk(req.userId)).role === "admin";

  if (isSelf || isAdmin) {
    return next();
  }
  return next(new Api403Error("You must be the data owner or administrator to access this data"))
  res.status(403).json({ message: "Forbidden. you must be the data owner or administrator to access this data" });
};

