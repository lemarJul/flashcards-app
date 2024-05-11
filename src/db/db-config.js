// @ts-check
/**
 * @typedef {import('sequelize').Options} Options
 */

const { isDevENV, localConfig } = require("../utils/development");

/**
 * Database configuration
 * @type {[String, String, String, Options]}
 * @property {String} 0 - database
 * @property {String} 1 - username
 * @property {String} 2 - password
 * @property {Options} 3 - options
 */
const config = isDevENV
  ? localConfig
  : [
      "",
      "",
      "",
      {
        host: "",
        dialect: "mariadb",
        dialectOptions: {
          timezone: "Etc/GMT-2",
        },
        logging: console.log,
      },
    ];

module.exports = config;
