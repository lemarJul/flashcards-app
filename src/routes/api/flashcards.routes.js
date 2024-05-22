const flashcardsController = require("../../controllers/flashcards/index.js");
const auth = require("../../middlewares/auth-user.middleware.js");
const router = require("express").Router();

const basePath = "/flashcards";
router.param("id", flashcardsController.findById);
router.get("/", flashcardsController.findAll);
router.post("/", auth.anyUser, flashcardsController.create);
router
  .route("/:id")
  .get(flashcardsController.sendLoadedResource)
  .delete(auth.anyUser, flashcardsController.deleteById)
  .put(auth.anyUser, flashcardsController.updateById);

module.exports = (app) => app.use(basePath, router);
