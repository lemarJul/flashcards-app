const { Api404Error } = require("../errors/api-errors");
const { SqlError } = require("mariadb");

module.exports = (service) => {
  async function create(req, res, next) {
    try {
      const rsc = await service.create(req.body);

      res.status(201).json({
        message: `${service.name} created successfully`,
        data: rsc,
      });
    } catch (err) {
      err.message = `Error in creating new ${service.name}: ${err.message}`;
      next(err);
    }
  }

  async function findById(req, res, next) {
    try {
      const rsc = preFetchedRsc(req) || (await service.findById(req.params.id));

      return res.status(200).json({
        message: `${service.name} with id ${rsc.id} successfully fetched.`,
        data: rsc,
      });
    } catch (err) {
      next(err);
    }
  }

  async function findAll(req, res, next) {
    try {
      console.log({ query: req.query });
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
      const { id } = req[service.name];
      await service.updateById(id, req.body);
      const rsc = await service.findById(id);
      res.json({
        message: `${service.name} with id ${id} updated successfully`,
        data: rsc,
      });
    } catch (error) {
      error.message = `Error in updating requested ${service.name} with id ${id} => ${error.message}`;
      next(error);
    }
  }

  async function deleteById(req, res, next) {
    try {
      const rsc = preFetchedRsc(req) || (await service.findById(req.params.id));
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

  function preFetchedRsc(req) {
    return req[service.name];
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
