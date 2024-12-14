//@ts-check
const { Model } = require("sequelize");

/**
 * @typedef {import('sequelize').Sequelize} Sequelize
 * @typedef {import('sequelize').DataTypes} DataTypes
 * @typedef {import('sequelize').ModelDefined<FlashcardAttributes, FlashcardCreationAttributes >} FlashCardModel
 * @typedef {Object} FlashcardAttributes
 * @property {number} id
 * @property {string} question
 * @property {string} answer
 * @property {string} category
 * @typedef {import('sequelize').Optional<FlashcardAttributes, 'id' | 'category'>} FlashcardCreationAttributes
 */

class Flashcard extends Model {
  static MIN_STEP = 0;
  static MAX_STEP = 6;
  static DAYS_TO_ADD = [1, 3, 7, 14, 30, 60, 120];

  async review(isSuccessful = false) {
    // @ts-ignore
    this.#scheduleNextReview(isSuccessful ? ++this.step : --this.step);
    return await this.save();
  }

  /**
   * Calculates and sets the next training date based on the provided step.
   * @param {number} step
   */
  #scheduleNextReview(step) {
    const MILLS_IN_A_DAY = 86400000;
    this.trainingDate = new Date(
      Date.now() + Flashcard.DAYS_TO_ADD[step] * MILLS_IN_A_DAY
    );
  }
}

/**
 * Flashcard Model - Represents a Flashcard
 * @param {Sequelize} sequelize Sequelize Instance
 * @param {DataTypes} DataTypes DataTypes
 * @returns {FlashCardModel} Flashcard Model
 */
module.exports = (sequelize, DataTypes) => {
  return Flashcard.init(
    /**
     * @type {import('sequelize').ModelAttributes}
     */
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      question: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Please enter a question" },
          len: {
            args: [0, 100],
            msg: "Question must be between 0 and 100 characters",
          },
        },
      },
      answer: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Please enter an answer" },
          len: {
            args: [0, 100],
            msg: "Answer must be between 0 and 100 characters",
          },
        },
      },

      category: {
        type: DataTypes.STRING,
        allowNull: true,
        /**
         * @returns {string[]}
         */
        get() {
          return this.getDataValue("category")?.split(",");
        },
        /**
         * @param {string[]} category
         */
        set(category) {
          this.setDataValue("category", category.join());
        },
      },

      step: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: Flashcard.MIN_STEP,
        validate: {
          min: {
            args: [Flashcard.MIN_STEP],
            msg: `Step must be at least ${Flashcard.MIN_STEP}`,
          },
          max: {
            args: [Flashcard.MAX_STEP],
            msg: `Step must be at most ${Flashcard.MAX_STEP}`,
          },
        },
        /**
         * @param {number} value
         */
        set(value) {
          if (value > Flashcard.MAX_STEP) value = Flashcard.MAX_STEP;
          if (value < Flashcard.MIN_STEP) value = Flashcard.MIN_STEP;

          this.setDataValue("step", value);
        },
      },
      nextReviewDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "Flashcard",
      timestamps: true,
      updatedAt: false,
    }
  );
};
