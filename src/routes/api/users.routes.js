const userController = require("../../controllers/users/index.js");
const {
  attachUserToRequest,
} = require("../../middlewares/users.middlewares.js");
const auth = require("../../middlewares/auth.middlewares.js");
const router = require("express").Router();

const basePath = "/users";
router.param("id", attachUserToRequest);
router
  .route("/:id")
  .all(auth.selfOrAdmin)
  .get(userController.sendLoadedResource)
  .delete(userController.deleteById)
  .put(userController.updateById);

module.exports = (app) => app.use(basePath, router);
