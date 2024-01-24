const { Api404Error } = require("../../errors/api-errors.js");
const BaseError = require("../../errors/base-error.js");

module.exports = (resourceName, Model) => {
  const findByPk = require("./find-by-pk.js")(resourceName, Model);
  return async (req, res, next, id) => {

  };
};