const userService = require("../services/user.service");
const baseMiddlewares = require("./base.middlewares");

module.exports = {
  attachUserToRequest: baseMiddlewares.attachResourceToRequest(userService),
};
