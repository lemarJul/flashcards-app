const isDev = process.env.NODE_ENV === "development";

const config = {
  database: isDev ? "mnemoniac" : "",
  username: isDev ? "root" : "",
  password: isDev ? "" : "",
  options: {
    host: isDev ? "localhost" : "",
    dialect: "mariadb",
    dialectOptions: {
      timezone: "Etc/GMT-2",
    },
    logging: isDev ? false : true,
  },
};

module.exports = Object.values(config);