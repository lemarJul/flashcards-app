const { Api500Error } = require("../../errors/api-errors.js");

module.exports = (resourceName, Model, modifier = null) => {
  return async (req, res, next) => {
    try {
      const DBloaded = req[resourceName];
      if (!DBloaded)
        throw new Api500Error(
          `${resourceName} with id ${req.params.id} has not been loaded.`
        );

      if (modifier) {
        modifier(req, resourceName);
      }

      const { id } = DBloaded;
      await Model.update(req.body, { where: { id } });
      const updatedResource = await Model.findByPk(id);

      res.status(200).json({
        message: `Requested ${resourceName} with id ${id} successfully updated`,
        data: updatedResource,
      });
    } catch (error) {
      error.message =
        `Error in updating requested ${resourceName} with id ${req.params.id}: ` +
        error.message;
      next(error);
    }
  };
};
