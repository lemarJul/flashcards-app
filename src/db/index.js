//@ts-check

const { Sequelize, DataTypes } = require("sequelize");
const { isDevENV } = require("../utils/development");
const dbConfig = require("./db.config.js");
const defineFlashcard = require("../models/flashcard.model.js");
const defineUser = require("../models/user.model.js");

const sequelize = new Sequelize(...dbConfig);

const User = defineUser(sequelize, DataTypes);
const Flashcard = defineFlashcard(sequelize, DataTypes);
// user has many flashcards
User.hasMany(Flashcard, {
  foreignKey: {
    name: "userId",
    allowNull: false,
  },
  onDelete: "CASCADE",
});
Flashcard.belongsTo(User, {
  foreignKey: {
    name: "userId",
    allowNull: false,
  },
});

async function init() {
  try {
    await sequelize.authenticate();
    console.log("DB Connection has been established successfully.");
    await sequelize.sync({ force: isDevENV ? true : false });
    console.log("DB Sync has been completed.");
    if (isDevENV) {
      await reset();
    }
    return sequelize;
  } catch (err) {
    console.error("Unable to connect to the database:", err);
    throw err;
  }
}

/**
 * Resets the database by creating an admin user, a regular user, and some flashcards.
 * @returns {Promise<void>} A promise that resolves when the database reset is complete.
 */
async function reset() {
  // Create an admin user and a regular user
  try {
    const userData = require("../utils/users.data.js");

    await sequelize.models.User.create(userData.admin);
    await sequelize.models.User.create(userData.user);
  } catch (e) {
    console.error(e);
  }

  // Create some flashcards
  try {
    const flashcardsStarter = require("../utils/flashcards-starter.json");
    for (let i = 0; i < flashcardsStarter.length; i++) {
      await sequelize.models.Flashcard.create(flashcardsStarter[i]);
      console.log(`flashcard ${i + 1} created successfully!`);
    }
  } catch (e) {
    console.error(e);
  }
}

module.exports = { init, Flashcard, User };
