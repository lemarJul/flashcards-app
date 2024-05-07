//@ts-check
const crypto = require("crypto");
const bcrypt = require("bcrypt");
/**
 * @typedef {import('sequelize').Sequelize} Sequelize
 * @typedef {import('sequelize').DataTypes} DataTypes
 * @typedef {import('sequelize').Model} Model
 * @typedef {import('sequelize').ModelStatic<Model>} ModelStatic
 */

/**
 * @param {Sequelize} sequelize Sequelize Instance
 * @param {DataTypes} DataTypes DataTypes
 * @returns {ModelStatic} User Model
 */
module.exports = (sequelize, DataTypes) => {
  return sequelize.define("User", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        name: "username",
        msg: "This username already exists",
      },
      validate: {
        notEmpty: {
          msg: "Please enter a username",
        },
        len: {
          args: [0, 15],
          msg: "Too long. Please enter a username between 0 and 15 characters",
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Please enter a password",
        },
      },
      /**
       * Hashes the password before saving it to the database
       * @param {String} value
       */
      set(value) {
        const hashedPassword = bcrypt.hashSync(value, 10);
        this.setDataValue("password", hashedPassword);
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        name: "email",
        msg: "This email is already in use",
      },
      validate: {
        notEmpty: {
          msg: "Please enter an email",
        },
        isEmail: {
          msg: "Please enter a valid email",
        },
        len: {
          args: [0, 255],
          msg: "Too long. Please enter an email between 0 and 255 characters",
        },
      },
    },
    emailConfirmed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      set(value) {
        if (value === true) {
          this.setDataValue("emailConfirmed", value);
        }
      },
    },

    confirmationToken: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: () => crypto.randomBytes(20).toString("hex"),
      set(value) {
        this.setDataValue("confirmationToken", value);
        this.setDataValue(
          "confirmationTokenExpires",
          new Date(Date.now() + 3600000)
        );
      },
    },
    confirmationTokenExpires: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: new Date(Date.now() + 3600000),
    },
    role: {
      type: DataTypes.ENUM("admin", "user"),
      allowNull: false,
      defaultValue: "user",
    },
  });
};
