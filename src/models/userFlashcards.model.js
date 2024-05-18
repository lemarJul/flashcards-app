// @ts-check
/**
 * @typedef {import('sequelize').Sequelize} Sequelize
 * @typedef {import('sequelize').DataTypes} DataTypes
 * @typedef {import('sequelize').Model} M
 * @typedef {import('sequelize').ModelStatic<M>} ModelStatic
 */

/**
 *  UserFlashcards Model - Represents the UserFlashcards table in the database.
 * @param {Sequelize} sequelize Sequelize Instance
 * @param {DataTypes} DataTypes DataTypes
 * @returns {ModelStatic} UserFlashcards Model
 */

module.exports = (sequelize, DataTypes) => {
  return sequelize.define("User_flashcard", {
    lastTraining: {
      type: DataTypes.DATE,
      defaultValue: null,
    },
    trainingCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    progress: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      validate: {
        max: 7,
        min: 1,
      },
    },
  });
};

/* // ? Implement UserFlashcards model as a class ?
const { Model } = require("sequelize");
class UserFlashcards extends Model {}
*/
