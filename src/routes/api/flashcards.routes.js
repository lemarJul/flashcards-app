const flashcardsController = require("../../controllers/flashcards/index.js");
const auth = require("../../middlewares/auth.middlewares.js");
const {
  attachFlashcardToRequest,
} = require("../../middlewares/flashcards.middlewares.js");
const router = require("express").Router();

const basePath = "/flashcards";
router.param("id", attachFlashcardToRequest);
router.get("/", flashcardsController.findAll);
router.post("/", auth.anyUser, flashcardsController.create);
router
  .route("/:id")
  .get(flashcardsController.sendLoadedResource)
  .delete(auth.anyUser, flashcardsController.deleteById)
  .put(auth.anyUser, flashcardsController.updateById);

module.exports = (app) => app.use(basePath, router);
