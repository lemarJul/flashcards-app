//@ts-check
const { url, dialectOptions, sync, logging } = require("config").get("database");
const { Sequelize, DataTypes, Model } = require("sequelize");
const { isDevENV } = require("../utils/utils");
const redisClient = require("./redis")
const sequelize = new Sequelize(url, { dialectOptions, logging });

const Models = [
  // Imports and associates models
  "../models/user.model.js",
  "../models/flashcard.model.js",
  "../models/confirmationToken.model.js",
]
  .map((path) => require(path))
  .map((createModel) => createModel(sequelize, DataTypes, Model))
  .map((model, _, models) => model.associate?.(models)); //call its associate method (if it exists) to define associations with other models.

/**
 * Connects to the database and syncs the models.
 * @returns {Promise<Sequelize>} A promise that resolves with the Sequelize instance if the connection and sync are successful, otherwise rejects with an error.
 */
async function connectDB() {
  try {
    // Connect to Redis
    await redisClient.connect();
    console.log("Redis connection established successfully.");

    // Connect to SQL database
    await sequelize.authenticate();
    console.log("DB Connection has been established successfully.");
    await sequelize.sync(sync);
    console.log("DB Sync has been completed.");
    if (isDevENV) await reset();
    return sequelize;
  } catch (err) {
    console.error("Unable to connect to the databases:", err);
    throw err;
  }
}

/**
 * Resets the database by creating an admin user, a regular user, and some flashcards.
 * @returns {Promise<void>} A promise that resolves when the database reset is complete.
 */
async function reset() {
  emptyAllModels();
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

async function emptyAllModels() {
  const modelsToEmpty = Object.values(sequelize.models); // Get an array of all your models

  const transaction = await sequelize.transaction();
  try {
    await Promise.all(modelsToEmpty.map((model) => model.destroy({ where: {}, transaction })));

    await transaction.commit();
    console.log("All models emptied successfully.");
  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error("Error emptying models:", error);
    throw error; // Re-throw for handling by the calling function
  }
}

/**
 * Closes the database connection.
 * @returns {Promise<void>} A promise that resolves when the connection is closed.
 */
async function disconnectDB() {
  try {
    // Close Redis connection
    await redisClient.disconnect();
    console.log("Redis connection closed successfully.");

    // Close SQL connection
    await sequelize.close();
    console.log("DB Connection has been closed successfully.");
  } catch (err) {
    console.error("Unable to close database connections:", err);
    throw err;
  }
}

module.exports = { connectDB, disconnectDB, redisClient, ...sequelize.models };
