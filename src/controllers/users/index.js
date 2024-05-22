const { User } = require("../../db");
const resourceName = "user";
const baseUpdate = require("../base-controller/update.js");


const userService = require("../../services/user.service");
//WIP: Implement the base controller
const baseController = require("../base.controller.js")(userService);

module.exports = {
  findById: require("../base-controller/find-by-pk.js")(resourceName, User),
  updateById: baseUpdate(resourceName, User),
  deleteById: require("../base-controller/delete-by-pk.js")(resourceName, User),
  sendLoadedResource: require("../base-controller/send-loaded-resource.js")(
    resourceName
  ),
  confirmEmail: require("./confirm-email.js"),
};
