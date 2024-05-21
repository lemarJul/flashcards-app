const userControllers = require("../../controllers/users/index.js");
const router = require("express").Router();
const authUser = require("../../middlewares/auth-user.middleware.js");
const isAdminOrSelf = require("../../middlewares/is-admin-or-self.middleware.js");

module.exports = (app, controller = userControllers) => {
  router.param("id", controller.findById);

  router
    .route("/users/:id")
    .all(authUser, isAdminOrSelf)
    .get(controller.sendLoadedResource)
    .delete(controller.deleteById)
    .put(controller.updateById);

  app.use(router);
};
