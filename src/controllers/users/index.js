const { User } = require("../../db").sequelize.models;
const resourceName = "user";
const baseUpdate = require("../base-controller/update.js");
const updateModifier = require("./update-modifier.js");

module.exports = {
  signup: require("./signup.js"),
  login: require("./login.js"),
  findById: require("../base-controller/find-by-pk.js")(resourceName, User),
  updateById: baseUpdate(resourceName, User, updateModifier),
  deleteById: require("../base-controller/delete-by-pk.js")(resourceName, User),
  sendLoadedResource: require("../base-controller/send-loaded-resource.js")(
    resourceName
  ),
  confirmEmail: require("./confirm-email.js"),
};
