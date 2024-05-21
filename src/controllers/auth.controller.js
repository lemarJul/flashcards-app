const { Api400Error, Api404Error } = require("../errors/api-errors.js");
const { BaseError } = require("sequelize");
const authService = require("../services/auth.service.js");

function login(req, res, next) {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new Api400Error("Please provide an email and a password");
  }
  authService
    .login(email, password)
    .then(({ token, user }) => {
      res.status(200).json({
        message: "Successfully logged in",
        data: user,
        token,
      });
    })
    .catch((err) => {
      if (!(err instanceof BaseError)) err.name = "Error in logging in";
      next(err);
    });
}

function register(req, res, next) {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    throw new Api400Error("Please provide a username, an email and a password");
  }
  authService
    .register(username, email, password)
    .then(({ token, user }) => {
      res.status(201).json({
        message: "Successfully registered",
        data: user,
        token,
      });
    })
    .catch((err) => {
      if (!(err instanceof BaseError)) err.name = "Error in registering";
      next(err);
    });
}

module.exports = { login, register };
