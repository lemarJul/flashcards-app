const { Flashcard } = require("../../db");
const { sequelize } = require("../../db");

module.exports = async (req, res, next) => {
  try {
    const flashcards = await Flashcard.findAll({
      attributes: [
        [sequelize.fn("DISTINCT", sequelize.col("category")), "category"],
      ],
    });

    //Since item.category return an array of categories, need to flatten the array
    const categories = flashcards.map(({ category }) => category).flat();

    //Since a flashcard can have several categories, the SQL DISTINC operation is not sufficient. The Set object is therefore used to remove possible duplicates
    const uniques = [...new Set(categories)];

    res.status(200).json({
      message: "List of categories successfully fetched",
      data: uniques,
    });
  } catch (error) {
    error.message = `Error in fetching list of categories: ${error.message}`;
    next(error)
  }
};
