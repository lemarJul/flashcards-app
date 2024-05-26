const service = require("../../services/flashcard.service.js");
const controller = require("../base.controller.js")(service);
const parseFinderOptions = require("./utils.controller.js");

module.exports = {
  create: [includeUserIdToBody, controller.create],
  findAll: [parseFinderOptions, controller.findAll],
  updateById: controller.updateById,
  deleteById: controller.deleteById,
  findById: controller.findById,
};

function includeUserIdToBody(req, res, next) {
  req.body.userId = req.authUser.id;
  next();
}
