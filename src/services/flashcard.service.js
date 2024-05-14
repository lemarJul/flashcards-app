const { Flashcard } = require("../db");
const createService = require("./base.service");

const { create, findById, updateById, deleteById, findAndCountAll } =
  createService("flashcard", Flashcard);

module.exports = {
  create,
  findById,
  findAndCountAll,
  updateById,
  deleteById,
};
