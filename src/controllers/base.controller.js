const { Api404Error } = require("../errors/api-errors");
const { SqlError } = require("mariadb");

module.exports = (service) => {
  function create(req, res, next) {
    service
      .create(req.body)
      .then((rsc) => {
        res.status(201).json({
          message: `${service.name} created successfully`,
          data: rsc,
        });
      })
      .catch((err) => {
        err.message = `Error in creating new ${service.name}: ${err.message}`;
        next(err);
      });
  }

  function findById(req, res, next, id) {

    service
      .findById(id)
      .then((rsc) => {
        return res.status(200).json({
          message: `${service.name} with id ${id} successfully fetched.`,
          data: rsc,
        });
      })
      .catch((err) => {
        next(err);
      });
  }

  async function findAll(req, res, next) {
    try {
      const rows = await service.findAll(req.findOptions);

      return res.status(200).json({
        message: `${rows.length} ${service.name} successfully fetched.`,
        data: rows,
      });
    } catch (error) {
      if (error instanceof SqlError) {
        // handle sql error
      }
      next(error);
    }
  }

  async function findAndCountAll(req, res, next) {
    try {
      const { count, rows } = await service.findAndCountAll(req.findOptions);

      return res.status(200).json({
        message: `${count} ${service.name} successfully fetched.`,
        count: count,
        data: rows,
      });
    } catch (error) {
      if (error instanceof SqlError) {
        // handle sql error
      }
      next(error);
    }
  }

  async function updateById(req, res, next) {
    try {
      await service.updateById(req.params.id, req.body);
      const rsc = await service.findById(req.params.id);
      if (!rsc) {
        throw new Api404Error(
          `Requested ${service.name} with id ${req.params.id} doesn't exist.`
        );
      }
      res.json({
        message: `${service.name} with id ${req.params.id} updated successfully`,
        data: rsc,
      });
    } catch (error) {
      error.message = `Error in updating requested ${service.name} with id ${req.params.id} => ${error.message}`;
      next(error);
    }
  }
  async function deleteById(req, res, next) {
    try {
      const rsc = req[service.name] || (await service.findById(req.params.id));
      if (!rsc) {
        throw new Api404Error(
          `Requested ${service.name} with id ${req.params.id} doesn't exist.`
        );
      }
      await service.deleteById(req.params.id);
      res.json({
        message: `${service.name} with id ${req.params.id} deleted successfully`,
        data: rsc,
      });
    } catch (error) {
      error.name = `Error in deleting requested ${service.name} with id ${req.params.id}`;
      next(error);
    }
  }
  function jsonReply(req, res, next) {
    res.json({
      message: "Resource loaded successfully",
      data: req[service.name],
    });
  }

  return {
    create,
    findById,
    findAll,
    findAndCountAll,
    updateById,
    deleteById,
  };
};
