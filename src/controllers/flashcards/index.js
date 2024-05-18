const service = require("../../services/flashcard.service.js");
const controller = require("../base.controller.js")(service);
const parseFinderOptions = require("./utils.controller.js");

module.exports = {
  create: controller.create,
  findAll: [parseFinderOptions, controller.findAll],
  updateById: controller.updateById,
  deleteById: controller.deleteById,
  findById: controller.findById,
  sendLoadedResource: require("../base-controller/send-loaded-resource.js")(
    service.name
  ),
};
