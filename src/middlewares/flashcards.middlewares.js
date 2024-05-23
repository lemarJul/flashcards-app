const flashcardService = require("../services/flashcard.service");
const baseMiddlewares = require("./base.middlewares");

module.exports = {
  attachFlashcardToRequest:
    baseMiddlewares.attachResourceToRequest(flashcardService),
};
