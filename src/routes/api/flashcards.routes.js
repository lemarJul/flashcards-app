const flashcardsController = require("../../controllers/flashcards/index.js");
const auth = require("../../middlewares/auth.middlewares.js");
const {
  attachFlashcardToRequest,
} = require("../../middlewares/flashcards.middlewares.js");

const router = require("express").Router();
router.all("*", auth.anyUser);
router.get("/", flashcardsController.findAll);
router.post("/", flashcardsController.create);
router.param("id", attachFlashcardToRequest);
router
  .route("/:id")
  .get(flashcardsController.sendLoadedResource)
  .delete(flashcardsController.deleteById)
  .put(flashcardsController.updateById);

module.exports = (app) => app.use("/flashcards", router);
