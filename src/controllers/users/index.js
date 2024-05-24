const userService = require("../../services/user.service");
const baseController = require("../base.controller.js")(userService);
const resourceName = "user";

module.exports = {
  findById: baseController.findById,
  updateById: baseController.updateById,
  deleteById: baseController.deleteById,
  confirmEmail: require("./confirm-email.js"),
};
