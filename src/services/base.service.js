module.exports = (Model) => {
  const modelName = Model.name.toLowerCase();
  function create(options) {
    return Model.create(options).catch((error) => {
      error.message = `Error in creating new ${modelName}: ${error.message}`;
      throw error;
    });
  }
  function findByPk(primaryKey) {
    return Model.findByPk(primaryKey).catch((error) => {
      error.message = `Error in fetching requested ${modelName} with primary key ${id}`;
      throw error;
    });
  }
  function findOne(whereOpt) {
    return Model.findOne({
      where: whereOpt,
    }).catch((error) => {
      error.message = `Error in fetching requested ${modelName} with name ${name}`;
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
    findByPk,
    findOne,
    findAll,
    findAndCountAll,
    updateById,
    deleteById,
    deleteAll,
  };
};
