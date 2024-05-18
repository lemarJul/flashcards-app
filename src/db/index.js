//@ts-check

const { Sequelize, DataTypes } = require("sequelize");
const { isDevENV } = require("../utils/development");
const dbConfig = require("./db-config.js");
const defineFlashcard = require("../models/flashcard.model.js");
const defineUser = require("../models/user.model.js");

const sequelize = new Sequelize(...dbConfig);

const Flashcard = defineFlashcard(sequelize, DataTypes);
const User = defineUser(sequelize, DataTypes);

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

  // Create an admin user and a regular user
  try {
    const adminOpt = {
      username: "admin",
      password: "admin",
      email: "admin@example.com",
      role: "admin",
      emailConfirmed: true,
    };
    const userOpt = {
      username: "user",
      password: "user",
      email: "user@example.com",
      role: "user",
    };

    await sequelize.models.User.create(adminOpt);
    await sequelize.models.User.create(userOpt);
  } catch (e) {
    console.error(e);
  }
}

module.exports = { init, Flashcard, User };
