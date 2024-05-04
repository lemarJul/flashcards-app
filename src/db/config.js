// @ts-check
/**
 * @typedef {import('sequelize').Options} Options
 */

const isDev = process.env.NODE_ENV === "development";

/**
 * Database configuration
 * @type {[String, String, String, Options]}
 * @property {String} 0 - database
 * @property {String} 1 - username
 * @property {String} 2 - password
 * @property {Options} 3 - options
 */
const config = [
  isDev ? "mnemoniac" : "",
  isDev ? "root" : "",
  isDev ? "" : "",
  {
    host: isDev ? "localhost" : "",
    dialect: "mariadb",
    dialectOptions: {
      timezone: "Etc/GMT-2",
    },
    logging: isDev ? false : true,
  },
];

module.exports = config;
