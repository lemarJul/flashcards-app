const authUser = require("../../middlewares/auth-user.middleware.js");
const flashcardsController = require("../../controllers/flashcards/index.js");
const router = require("express").Router();

module.exports = (app, controller = flashcardsController) => {
  router.param("id", controller.findById);
  router
    .route("/flashcards")
    .get(controller.findAll)
    .post(authUser, controller.create);
  router
    .route("/flashcards/:id")
    .get(controller.sendLoadedResource)
    .delete(authUser, controller.deleteById)
    .put(authUser, controller.updateById);

  app.use(router);
};
