const { Api404Error } = require("../../errors/api-errors.js");
const BaseError = require("../../errors/base-error.js");

module.exports = (resourceName, Model) => {
  return async (req, res, next, id) => {
    try {
      const found = await Model.findByPk(id);

      if (!found)
        throw new Api404Error(
          `Requested ${resourceName} with id ${id} doesn't exist.`
        );

      req[resourceName] = found;
      next();
    } catch (error) {
      if (!(error instanceof BaseError))
        error.name = `Error in fetching requested resource with id ${id}`;
      next(error);
    }
  };
};
