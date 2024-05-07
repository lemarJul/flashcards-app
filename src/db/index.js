//@ts-check

const { Sequelize, DataTypes } = require("sequelize");
const config = require("./config.js");
//models
const FlashcardModel = require("./models/flashcard-model.js");
const UserModel = require("./models/user-model.js");
const UserFlashcardsModel = require("./models/userFlashcards-model.js");
//data
const flashcardsStarter = require("../utils/flashcards-starter.json");
//password hashing
const bcrypt = require("bcrypt");

const sequelize = new Sequelize(...config);

sequelize
  .authenticate()
  .then(() => console.log("DB Connection has been established successfully."))
  .catch((err) => console.error("Unable to connect to the database:", err));

const Flashcard = FlashcardModel(sequelize, DataTypes);
const User = UserModel(sequelize, DataTypes);
//const UserFlashcards = UserFlashcardsModel(sequelize, DataTypes);
// User.Flashcards = User.belongsToMany(Flashcard, { through: UserFlashcards });
// Flashcard.Users = Flashcard.belongsToMany(User, { through: UserFlashcards });

/**
 * Initializes the database tables and creates initial data.
 * @returns {Promise<void>} A promise that resolves when the initialization is complete.
 */
const initTables = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log("Database synced!");

    const hash = await bcrypt.hash("admin", 10);
    const userHash = await bcrypt.hash("user", 10);

    const admin = await User.create({
      username: "admin",
      password: hash,
      email: "admin@example.com",
      role: "admin",
      emailConfirmed: true,
    });

    const user = await User.create({
      username: "user",
      password: userHash,
      email: "user@example.com",
    });

    await Promise.all(
      flashcardsStarter.map(async (fc, i) => {
        await Flashcard.create(fc);
        console.log(`flashcard ${i + 1} created successfully!`);
      })
    );
  } catch (e) {
    console.error(e);
  }
};

module.exports = { initTables, Flashcard, User, sequelize };
