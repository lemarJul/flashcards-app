const dialect = "mariadb";
const port = "";
const dbName = "mnemoniac";
const host = "localhost";
const user = "root";
const password = "";
const url = `${dialect}://${user}:${password}@${host}:${port}/${dbName}`;

const config = {
  database: {
    dialect,
    host,
    user,
    password,
    name: dbName,
    port,
    url,

    sync: {
      force: true,
      alter: true,
    },
    logging: console.log,
  },
  logging: ["dev"],
};

module.exports = config;
