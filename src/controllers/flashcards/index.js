const BaseController = require("../base-controller/index.js");
const { Flashcard } = require("../../db").sequelize.models;
const resourceName = "flashcard";
const baseUpdate = require("../base-controller/update.js");
const updateModifier = require("./update-modifier.js");

module.exports = {
  create: require("../base-controller/create.js")(resourceName, Flashcard),
  findAll: require("./find-all.js"),
  updateById: baseUpdate(resourceName, Flashcard, updateModifier),
  deleteById: require("../base-controller/delete-by-pk.js")(
    resourceName,
    Flashcard
  ),
  findById: require("../base-controller/find-by-pk.js")(
    resourceName,
    Flashcard
  ),
  sendLoadedResource: require("../base-controller/send-loaded-resource.js")(
    resourceName
  ),
};
