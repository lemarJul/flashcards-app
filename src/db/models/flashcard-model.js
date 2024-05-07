//@ts-check
/**
 * @typedef {import('sequelize').Sequelize} Sequelize
 * @typedef {import('sequelize').DataTypes} DataTypes
 * @typedef {import('sequelize').Model} Model
 * @typedef {import('sequelize').ModelStatic<Model>} ModelStatic
 */

/**
 *  Flashcard Model - Represents a Flashcard
 * @param {Sequelize} sequelize Sequelize Instance
 * @param {DataTypes} DataTypes DataTypes
 * @returns {ModelStatic} Flashcard Model
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
      },
      question: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          name: "question",
          msg: "This question already exists",
        },
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
    {
      timestamps: true,
      updatedAt: false,
    }
  );
};


