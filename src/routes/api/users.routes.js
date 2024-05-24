const userController = require("../../controllers/users/index.js");
const {
  attachUserToRequest,
} = require("../../middlewares/users.middlewares.js");
const auth = require("../../middlewares/auth.middlewares.js");
const router = require("express").Router();

router.all("*", auth.selfOrAdmin);
router.param("id", attachUserToRequest);
router.route("/:id")
  .get(userController.findById)
  .delete(userController.deleteById)
  .put(userController.updateById);

module.exports = (app) => app.use("/users", router);
