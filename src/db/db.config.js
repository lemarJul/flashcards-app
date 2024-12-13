// @ts-check
/**
 * @typedef {import('sequelize').Options} Options
 */

const { isDevENV } = require("../utils/utils");
const {
  DB_DATABASE,
  DB_USERNAME,
  DB_PASSWORD,
  DB_HOST,
  DB_DIALECT,
  DB_PORT,
  DB_URI,
} = process.env;

const URI =
  DB_URI ||
  `${DB_DIALECT}://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}`;

/**
 * Database configuration.  This module exports a configuration array suitable for use with Sequelize.
 * The array contains the database URI and a set of options.  The URI is constructed from environment variables
 * if DB_URI is not set. Logging is enabled in development environments.
 * @type {[String, Options] }
 * @property {String} URI
 * @see https://sequelize.org/docs/v6/getting-started/#configuration
 */
const config = [
  URI,
  {
    dialectOptions: {
      timezone: "Etc/GMT-2",
    },
    logging: isDevENV ? console.log : false,
  },
];

module.exports = config;
