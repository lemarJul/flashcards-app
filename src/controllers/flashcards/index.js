const service = require("../../services/flashcard.service.js");
const controller = require("../base.controller.js")(service);
const parseFinderOptions = require("./utils.controller.js");
const { requireDefinedProps } = require("../utils.js");

module.exports = {
  create: [includeUserIdToBody, controller.create],
  findAll: [parseFinderOptions, controller.findAll],
  updateById: controller.updateById,
  deleteById: controller.deleteById,
  findById: controller.findById,
  processStudiedFlashcards,
};

function includeUserIdToBody(req, res, next) {
  req.body.userId = req.authUser.id;
  next();
}

async function processStudiedFlashcards(req, res, next) {
  try {
    const { flashcards: studiedFlashcards } = requireDefinedProps(req.body);

    const output = await Promise.all(
      studiedFlashcards.map(async ({ id, isSuccessful }) => {
        try {
          const flashcard = await service.findById(id);

          return flashcard.study(isSuccessful);
        } catch (err) {
          next(err);
        }
      })
    );

    res.status(200).json({
      message: "the study of flashcards has been taken into account",
      data: output,
    });
  } catch (err) {
    next(err);
  }
}
