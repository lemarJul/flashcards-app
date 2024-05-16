module.exports = (Model) => {
  const modelName = Model.name.toLowerCase();
  function create(options) {
    return Model.create(options).catch((error) => {
      error.message = `Error in creating new ${modelName}: ${error.message}`;
      throw error;
    });
  }
  function findById(id) {
    return Model.findByPk(id).catch((error) => {
      error.message = `Error in fetching requested ${modelName} with id ${id}`;
      throw error;
    });
  }
  function findAll(options) {
    return Model.findAll(options).catch((error) => {
      error.message = `Error in fetching all ${modelName}`;
      throw error;
    });
  }
  function findAndCountAll(options) {
    return Model.findAndCountAll(options).catch((error) => {
      error.message = `Error in fetching all ${modelName}`;
      throw error;
    });
  }
  function updateById(id, data) {
    return Model.update(data, {
      where: {
        id: id,
      },
    }).catch((error) => {
      error.message = `Error in updating ${modelName} with id ${id}`;
      throw error;
    });
  }
  function deleteById(id) {
    return Model.destroy({
      where: {
        id: id,
      },
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
    findById,
    findAll,
    findAndCountAll,
    updateById,
    deleteById,
    deleteAll,
  };
};
