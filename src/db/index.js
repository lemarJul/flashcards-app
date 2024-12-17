//@ts-check
const { Sequelize, DataTypes, Model } = require("sequelize");
const { isDevENV } = require("../utils/utils");
const { config: dbConfig } = require("./db.config.js");
const sequelize = new Sequelize(...dbConfig);

// Imports and associates models
["../models/user.model.js", "../models/flashcard.model.js", "../models/confirmationToken.model.js"]
  .map((path) => require(path))
  .map((createModel) => createModel(sequelize, DataTypes, Model))
  .forEach((model, _, models) => model.associate?.(models)); //call its associate method (if it exists) to define associations with other models.

console.log({ models: sequelize.models });
/**
 * Connects to the database and syncs the models.
 * @returns {Promise<Sequelize>} A promise that resolves with the Sequelize instance if the connection and sync are successful, otherwise rejects with an error.
 */
async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log("DB Connection has been established successfully.");
    await sequelize.sync({ force: isDevENV });
    console.log("DB Sync has been completed.");
    if (isDevENV) await reset();
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
    const { admin, user } = require("../samples/users.sample.js");

    await sequelize.models.User.create(admin);
    await sequelize.models.User.create(user);
  } catch (e) {
    console.error(e);
  }

  // Create some flashcards
  try {
    const flashcardsStarter = require("../samples/flashcards.sample.json");
    for (const flashcardData of flashcardsStarter) {
      await sequelize.models.Flashcard.create(flashcardData);
    }
  } catch (e) {
    console.error(e);
  }
}

/**
 * Closes the database connection.
 * @returns {Promise<void>} A promise that resolves when the connection is closed.
 */
async function disconnectDB() {
  try {
    await sequelize.close();
    console.log("DB Connection has been closed successfully.");
  } catch (err) {
    console.error("Unable to close the database connection:", err);
    throw err;
  }
}

module.exports = { connectDB, disconnectDB, ...sequelize.models };
