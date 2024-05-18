//@ts-check
const { noUpdate } = require("./utils.model");

/**
 * @typedef {import('sequelize').Sequelize} Sequelize
 * @typedef {import('sequelize').DataTypes} DataTypes
 * @typedef {import('sequelize').ModelDefined<FlashcardAttributes, FlashcardCreationAttributes >} FlashCardModel
 * @typedef {Object} FlashcardAttributes
 * @property {Number} id
 * @property {String} question
 * @property {String} answer
 * @property {String} category
 * @typedef {import('sequelize').Optional<FlashcardAttributes, 'id' | 'category'>} FlashcardCreationAttributes
 */

/**
 *  Flashcard Model - Represents a Flashcard
 * @param {Sequelize} sequelize Sequelize Instance
 * @param {DataTypes} DataTypes DataTypes
 * @returns {FlashCardModel} Flashcard Model
 */
module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "Flashcard",
    /**
     * @type {import('sequelize').ModelAttributes}
     */
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        set: noUpdate("id"),
      },
      question: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Please enter a question",
          },
          len: {
            args: [0, 100],
            msg: "Too long. Please enter a question between 0 and 100 characters",
          },
        },
      },
      answer: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Please enter an answer",
          },
          len: {
            args: [0, 100],
            msg: "Too long. Please enter a response between 0 and 100 characters",
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
    },

    /**
     * @type {import('sequelize').ModelOptions}
     */
    {
      timestamps: true,
      updatedAt: false,
    }
  );
};
