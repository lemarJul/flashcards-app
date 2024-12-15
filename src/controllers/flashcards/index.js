const service = require("../../services/flashcard.service.js");
const controller = require("../base.controller.js")(service);
const parseFinderOptions = require("./utils.controller.js");
const { requireDefinedProps } = require("../utils.js");

function includeUserIdToBody(req, res, next) {
  req.body.userId = req.authUser.id;
  next();
}

async function processFlashcardReviews(req, res, next) {
  try {
    const { flashcards: reviews } = requireDefinedProps(req.body);

    res.status(200).json({
      message: "the study of flashcards has been taken into account",
      data: await controller.processFlashcardReviews(reviews),
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  create: [includeUserIdToBody, controller.create],
  findAll: [parseFinderOptions, controller.findAll],
  updateById: controller.updateById,
  deleteById: controller.deleteById,
  findById: controller.findById,
  processFlashcardReviews,
};
