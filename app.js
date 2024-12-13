//node_modules
const express = require("express");
const bodyParser = require("body-parser");
const favicon = require("serve-favicon");
const cors = require("cors");
const logger = require("morgan");
const path = require("path");
const fs = require("fs");
const engine = require("ejs-mate");

// Project modules
const { connectDB } = require("./src/db");
const routes = require("./src/routes");
const { isDevENV } = require("./src/utils/utils");
const errorsHandler = require("./src/errors/errors-handler");
const invalidPathHandler = require("./src/errors/invalid-path-handler");

// Configuration
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);
const logConfig = isDevENV
  ? ["dev"]
  : ["combined", { stream: accessLogStream }];

connectDB();

module.exports = class MnemoniacApp extends express {
  constructor() {
    super();
    this.engine("ejs", engine);
    this.set("view engine", "ejs");
    this.set("views", __dirname + "/views");
    this.use(logger(...logConfig));
    this.use(favicon(__dirname + "/public/images/card.ico"));
    this.use(bodyParser.urlencoded({ extended: false }));
    this.use(bodyParser.json());
    this.use(cors());
    this.use(routes);
    this.use(errorsHandler);
    this.use(invalidPathHandler);
  }
};
