const { Op } = require("sequelize");
const { parseHyphenatedString } = require("../../utils/utils.js");
const { Flashcard } = require("../../db/index.js");

//TODO: get rid of the require Model (orderClause)
function parseFinderOptions(req, res, next) {
  const defaultOrder = "category";
  const { category, content, limit, offset, order } = req.query;

  req.findOptions = {
    where: whereClause(),
    limit: parseInt(limit) || null,
    offset: parseInt(offset) || null,
    order: orderClause(),
  };
  next();

  function whereClause() {
    const output = {};

    if (category) output.category = parseCategory();

    if (content) {
      output[Op.or] = [
        { question: { [Op.like]: `%${content}%` } },
        { answer: { [Op.like]: `%${content}%` } },
      ];
    }

    return output;
  }

  function parseCategory() {
    const arr = Array.isArray(category) ? category : category.split(","); // allow passing ?category=1&category=2 as well as ?category=1,2
    return arr.map((category) => parseHyphenatedString(category));
  }

  function orderClause() {
    const orderExist = order && order in Flashcard.getAttributes();
    return [orderExist ? order : defaultOrder];
  }
}

module.exports = parseFinderOptions;
