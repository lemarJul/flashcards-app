const isDevENV = process.env.NODE_ENV === "development";

/**
 * Database configuration
 * @type {[String, String, String, Options]}
 * @property {String} 0 - database
 * @property {String} 1 - username
 * @property {String} 2 - password
 * @property {Options} 3 - options
 */
const localConfig = [
  "mnemoniac",
  "root",
  "",
  {
    host: "localhost",
    dialect: "mariadb",
    dialectOptions: {
      timezone: "Etc/GMT-2",
    },
    logging: false,
  },
];



module.exports = { isDevENV, localConfig };
