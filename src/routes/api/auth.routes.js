const authController = require("../../controllers/auth.controller.js");
const router = require("express").Router();

const basePath = "/auth";
router.post("/login", authController.login);
router.post("/register", authController.register);
router.get("/confirm-email/:token", authController.confirmUserEmail);

module.exports = (app) => app.use(basePath, router);
