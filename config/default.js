const server = {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV,
};
const app = {
  name: "mnemoniac_api",
  version: process.env.npm_package_version || "1.0.0",
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET,
};

const database = {
  dialect: process.env.DB_DIALECT || "mariadb",
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "mnemoniac",
  port: process.env.DB_PORT || 27017,

  sync: {
    force: process.env.DB_SYNC_FORCE || false,
    alter: process.env.DB_SYNC_ALTER || false,
  },
  dialectOptions: {
    timezone: "Etc/GMT+1",
  },
  logging: false,
};
database.url =
  process.env.DB_URL ||
  `${database.dialect}://${database.user}:${database.password}@${database.host}:/${database.dbName}`;

module.exports = { server, app, database, logging: "common" };
