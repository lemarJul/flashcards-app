const { Flashcard } = require("../../db");
const { Op } = require("sequelize");
const { parseHyphenatedString } = require("../../utils.js");
const { SqlError } = require("mariadb");
const retry = require("async-retry");
const fetch = require("node-fetch");

module.exports = async (req, res, next) => {
  const searchOptions = toSearchOptions(req.query);

  try {
    const { count, rows } = await Flashcard.findAndCountAll(searchOptions);

    return res.status(200).json({
      message: `${count} flashcards successfully fetched.`,
      count: count,
      data: rows,
    });
  } catch (error) {
    if (error instanceof SqlError) {
    }
    next(error);
  }

  
  function toSearchOptions(query) {
    const { category, content, limit, offset, order } = query;
    const output = {};
    output.where = {};
    output.limit = parseInt(limit) || null;
    output.offset = parseInt(offset) || null;

    if (category) {
      let temp = Array.isArray(category) ? category : category.split(","); // allow passing ?category=1&category=2 as well as ?category=1,2

      output.where.category = temp.map((category) =>
        parseHyphenatedString(category)
      );
    }

    if (content) {
      output.where[Op.or] = [
        { question: { [Op.like]: `%${content}%` } },
        { answer: { [Op.like]: `%${content}%` } },
      ];
    }

    if (order) {
      const isKnownOrder = () => order && order in Flashcard.rawAttributes;
      const defaultOrder = "category";
      output.order = isKnownOrder() ? [order] : [defaultOrder];
    }

    return output;
  }
};
