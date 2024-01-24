const { Api500Error } = require("../../errors/api-errors");

module.exports = (resourceName, Model) => {
  return async (req, res, next) => {
    const { [resourceName]: loaded } = req;
    const { id } = req.params;

    try {
      await Model.destroy({ where: { id } });

      res.json({
        message: `${resourceName} with id ${id} deleted successfully`,
        data: loaded,
      });
    } catch (error) {
      error.name = `Error in deleting requested ${resourceName} with id ${id}`;
      next(error);
    }
  };
};
