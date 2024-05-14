module.exports = (resourceName, Model) => {
  function create(options) {
    return Model.create(options).catch((error) => {
      error.message = `Error in creating new ${resourceName}: ${error.message}`;
      throw error;
    });
  }
  function findById(id) {
    return Model.findByPk(id).catch((error) => {
      error.message = `Error in fetching requested ${resourceName} with id ${id}`;
      throw error;
    });
  }
  function findAll(options) {
    return Model.findAll(options).catch((error) => {
      error.message = `Error in fetching all ${resourceName}`;
      throw error;
    });
  }
  function findAndCountAll(options) {
    return Model.findAndCountAll(options).catch((error) => {
      error.message = `Error in fetching all ${resourceName}`;
      throw error;
    });
  }
  function updateById(id, options) {
    return Model.update(options, {
      where: {
        id: id,
      },
    }).catch((error) => {
      error.message = `Error in updating ${resourceName} with id ${id}`;
      throw error;
    });
  }
  function deleteById(id) {
    return Model.destroy({
      where: {
        id: id,
      },
    }).catch((error) => {
      error.message = `Error in deleting ${resourceName} with id ${id}`;
      throw error;
    });
  }
  function deleteAll() {
    return Model.destroy({
      where: {},
      truncate: true,
    }).catch((error) => {
      error.message = `Error in deleting all ${resourceName}`;
      throw error;
    });
  }

  return {
    create,
    findById,
    findAll,
    findAndCountAll,
    updateById,
    deleteById,
    deleteAll,
  };
};
