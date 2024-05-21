const authController = require("../../controllers/auth.controller.js");
const router = require("express").Router();

module.exports = (app) => {
  const route = "/auth";
  router.post(route + "/login", authController.login);
  router.post(route + "/register", authController.register);

  app.use(router);

};