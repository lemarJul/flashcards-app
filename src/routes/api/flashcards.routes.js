const auth = require("../../auth/auth.js");
const flashcardsController = require("../../controllers/flashcards/index.js");
const router = require("express").Router();

module.exports = (app, controller = flashcardsController) => {
  router.param("id", controller.findById);
  router
    .route("/flashcards")
    .get(controller.findAll)
    .post(auth, controller.create);
  router
    .route("/flashcards/:id")
    .get(controller.sendLoadedResource)
    .delete(auth, controller.deleteById)
    .put(auth, controller.updateById);

  app.use(router);
};
