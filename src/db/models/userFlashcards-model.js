const {Model} = require("sequelize"); 

module.exports = (sequelize, DataTypes) => {
  return sequelize.define("user_flashcard", {
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
      max: 7,
      min: 1,
    },
  });
};

class UserFlashcards extends Model {

}
