const userService = require("../services/user.service");

module.exports = {
  attachUserToRequest:
    require("./base.middleware").attachResourceToRequest(userService),
};
