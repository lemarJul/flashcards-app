//const { error } = require("console");
const { Flashcard } = require("../db");
const { name, create, findByPk, findAll, findAndCountAll, updateById } =
  require("./base.service")(Flashcard);

module.exports = {
  name,
  create,
  findById: findByPk,
  findAll,
  findAndCountAll,
  updateById: (id, data) => {
    delete data.id;
    return baseService.updateById(id, data);
  },

  /**
   * Processes an array of flashcard review results.  Updates the flashcards in the database based on the review results.
   * @param {Array<Object>} reviews - An array of objects, each containing an `id` (flashcard ID) and `isSuccessful` (boolean indicating review success).
   * @returns {Promise<Array<Object>>} - A promise that resolves to an array of objects. Each object represents the result of a flashcard review.  Successful reviews contain the updated flashcard data. Failed reviews contain an `error` property and the original flashcard data.
   * @throws {Error} If any errors occur during the processing or database update, an error is thrown containing a summary of the individual errors.
   */
  processFlashcardReviews: async (reviews) => {
    const { ids, isSuccessful } = reviews.reduce(
      (output, { id, isSuccessful }) => {
        output.ids.push(id);
        output.isSuccessful.push(isSuccessful);
        return output;
      },
      { ids: [], isSuccessful: [] } // initial output
    );

    try {
      const flashcards = await findAll({ where: { id: ids } });

      const reviewedFlashcards = await Promise.all(
        flashcards.map(async (aFlashcard, index) => {
          try {
            return await aFlashcard.review(isSuccessful[index]);
          } catch (error) {
            logger.error(
              `Error updating flashcard ${aFlashcard.id}: ${error.message}`
            );
            return { error, id: aFlashcard.id };
          }
        })
      );

      const errors = reviewedFlashcards.filter((reviewed) => reviewed.error);

      console.info(
        `Processed ${reviewedFlashcards.length} flashcard reviews. Successes: ${
          reviewedFlashcards.length - errors.length
        }, Errors: ${errors}`
      );

      if (errors.length > 0) {
        const errorMessages = errors.map(
          (err) => `Flashcard ${err.id}: ${err.error}`
        );
        throw new Error(
          `Errors during flashcard review: ${errorMessages.join(", ")}`
        );
      }

      return reviewedFlashcards;
    } catch (error) {
      console.error(`Error processing flashcard reviews: ${error}`);
      throw new Error(
        "The study of flashcards has encountered an unexpected issue. Please check the logs for more details.",
        error
      );
    }
  },
};
