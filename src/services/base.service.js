const { BaseError } = require("sequelize");
const { Api404Error } = require("../errors/api-errors");

module.exports = (Model) => {
  /** @type {string} */
  const modelName = Model.name.toLowerCase();
  function create(options) {
    return Model.create(options).catch((error) => {
      error.message = `Error in creating new ${modelName}: ${error.message}`;
      throw error;
    });
  }
  function findByPk(primaryKey) {
    return Model.findByPk(primaryKey)
      .then((resource) => {
        if (!resource)
          throw new Api404Error(`requested ${modelName} with primary key ${primaryKey} not found`);
        return resource;
      })
      .catch((error) => {
        if (!(error instanceof BaseError))
          error.message = `Error in fetching requested ${modelName} with primary key ${primaryKey}`;
        throw error;
      });
  }
  function findOne(query) {
    return Model.findOne(query)
      .then((ressource) => {
        if (!ressource) throw new Api404Error(`requested ${modelName} where ${whereOpt} not found`);
        return ressource;
      })
      .catch((error) => {
        if (!(error instanceof BaseError))
          error.message = `Error in fetching requested ${modelName} where ${whereOpt}`;
        throw error;
      });
  }
  function findAll(query) {
    return Model.findAll(query).catch((error) => {
      error.message = `Error in fetching all ${modelName}`;
      throw error;
    });
  }
  function findAndCountAll(query) {
    return Model.findAndCountAll(query).catch((error) => {
      error.message = `Error in fetching all ${modelName}`;
      throw error;
    });
  }
  function updateById(id, data) {
    return Model.update(data, {
      where: { id },
    }).catch((error) => {
      error.message = `Error in updating ${modelName} with id ${id}`;
      throw error;
    });
  }
  function deleteById(id) {
    return Model.destroy({
      where: { id },
    }).catch((error) => {
      error.message = `Error in deleting ${modelName} with id ${id}`;
      throw error;
    });
  }
  function deleteAll() {
    return Model.destroy({
      where: {},
      truncate: true,
    }).catch((error) => {
      error.message = `Error in deleting all ${modelName}`;
      throw error;
    });
  }

  return {
    name: modelName,
    create,
    findByPk,
    findOne,
    findAll,
    findAndCountAll,
    updateById,
    deleteById,
    deleteAll,
  };
};
