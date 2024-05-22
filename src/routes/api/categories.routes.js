const categoriesController = require("../../controllers/categories");
const router = require("express").Router();

const basePath = "/categories";
router.get("/", categoriesController.findAll);

module.exports = (app) => app.use(basePath, router);
