// @ts-check
/**
 * @typedef {import('sequelize').Options} Options
 */

const { isDevENV, local_config } = require("../utils/development");

/**
 * Database configuration
 * @type {[String, String, String, Options]}
 * @property {String} 0 - database
 * @property {String} 1 - username
 * @property {String} 2 - password
 * @property {Options} 3 - options
 */
const config = isDevENV
  ? local_config
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
        logging: true,
      },
    ];

module.exports = config;
