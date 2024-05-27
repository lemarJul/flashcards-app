//@ts-check
const { Model } = require("sequelize");
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

class Flashcard extends Model {
  static MAX_STEP = 7;
  static MIN_STEP = 0;

  static associate(models) {
    Flashcard.belongsTo(models.User, {
      foreignKey: {
        name: "userId",
        allowNull: false,
      },
    });
  }
  async study(isSuccessful) {
    isSuccessful ? this.#stepUp() : this.#stepDown();

    this.#defineNextTrainingDate();
    return await this.save();
  }

  #stepUp() {
    if (this.step < Flashcard.MAX_STEP) this.step++;
  }
  #stepDown() {
    // never go below 1 after the first step has been completed
    if (this.step > 1) this.step--;
  }

  #defineNextTrainingDate() {
    const now = new Date();
    switch (this.step) {
      case 0:
        this.nextTrainingDate = now;
        break;
      case 1:
        this.nextTrainingDate = new Date(now.setDate(now.getDate() + 1));
        break;
      case 2:
        this.nextTrainingDate = new Date(now.setDate(now.getDate() + 3));
        break;
      case 3:
        this.nextTrainingDate = new Date(now.setDate(now.getDate() + 7));
        break;
      case 4:
        this.nextTrainingDate = new Date(now.setDate(now.getDate() + 14));
        break;
      case 5:
        this.nextTrainingDate = new Date(now.setDate(now.getDate() + 30));
        break;
      case 6:
        this.nextTrainingDate = new Date(now.setDate(now.getDate() + 60));
        break;
      case 7:
        this.nextTrainingDate = new Date(now.setDate(now.getDate() + 120));
      default:
        break;
    }
  }
}

/**
 *  Flashcard Model - Represents a Flashcard
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

      step: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: {
            args: [Flashcard.MIN_STEP],
            msg: "Step must be greater than or equal to 0",
          },
          max: {
            args: [Flashcard.MAX_STEP],
            msg: "Step must be less than or equal to 7",
          },
        },
      },

      nextTrainingDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date(),
      },
    },

    /**
     * @type {import('sequelize').ModelOptions}
     */
    {
      sequelize,
      modelName: "Flashcard",
      timestamps: true,
      updatedAt: false,
    }
  );
};
