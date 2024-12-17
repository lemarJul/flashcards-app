const { Api400Error, Api404Error } = require("../errors/api-errors.js");
const { BaseError } = require("sequelize");
const authService = require("../services/auth.service.js");
const { requireDefinedProps } = require("./utils.js");

function login(req, res, next) {
  const { email, password } = requireDefinedProps(req.body);

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
  const { username, email, password } = requireDefinedProps(req.body);

  authService
    .register(username, email, password)
    .then((user) => {
      res.status(201).json({
        message: "Successfully registered. Please confirm your email.",
        data: user,
      });
    })
    .catch((err) => {
      if (!(err instanceof BaseError)) err.name = "Error in registering";
      next(err);
    });
}

async function confirmUserEmail(req, res, next) {
  try {
    const user = await authService.confirmUserEmail(req.params.token);

    res.json({
      message: "Email confirmed",
      data: user,
    });
  } catch (err) {
    if (!(err instanceof BaseError))
      err.message = `Error in confirming email: ${err.message}`;

    next(err);
  }
}

module.exports = { login, register, confirmUserEmail };
