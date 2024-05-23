const { Flashcard } = require("../db");
const baseService = require("./base.service")(Flashcard);

module.exports.name = baseService.name;
module.exports.create = baseService.create;
module.exports.findById = baseService.findByPk;
module.exports.findAll = baseService.findAll;
module.exports.findAndCountAll = baseService.findAndCountAll;
module.exports.updateById = (id, data) => {
  delete data.id;
  return baseService.updateById(id, data);
};
module.exports.deleteById = baseService.deleteById;
