
const { Api500Error } = require("../../errors/api-errors.js");

module.exports = (resourceName) => {
  return async (req, res, next) => {
    const { id } = req.params;
    const loaded = req[resourceName];
    const operation = `Requested ${resourceName} with id ${id} `;
    const fail = operation + "has not been loaded.";
    const success = operation + "successfully fetched";

    if (!loaded) return next(new Api500Error(fail));

    res.json({
      message: success,
      data: loaded,
    });
  };
};
