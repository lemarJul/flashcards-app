//@ts-check
const { Sequelize, DataTypes } = require("sequelize");
const { isDevENV } = require("../utils/utils");
const dbConfig = require("./db.config.js");
const sequelize = new Sequelize(...dbConfig);
// Models
const User = require("../models/user.model.js")(sequelize, DataTypes);
const Flashcard = require("../models/flashcard.model.js")(sequelize, DataTypes);
// Model's associations
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

/**
 * Initializes the database connection and synchronizes the models.
 * If the environment is development (isDevENV is true), it also resets the database.
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
    const userData = require("../samples/users.sample.js");

    await sequelize.models.User.create(userData.admin);
    await sequelize.models.User.create(userData.user);
  } catch (e) {
    console.error(e);
  }

  // Create some flashcards
  try {
    const flashcardsStarter = require("../samples/flashcards.sample.json");
    for (let i = 0; i < flashcardsStarter.length; i++) {
      await sequelize.models.Flashcard.create(flashcardsStarter[i]);
      console.log(`flashcard ${i + 1} created successfully!`);
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

module.exports = { connectDB, disconnectDB, Flashcard, User };
