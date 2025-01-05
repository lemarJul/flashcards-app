// Project modules
const { connectDB } = require("./src/db");
const routes = require("./src/routes");
const errorsHandler = require("./src/errors/errors-handler");
const invalidPathHandler = require("./src/errors/invalid-path-handler");

//node_modules
const express = require("express");
const bodyParser = require("body-parser");
const favicon = require("serve-favicon");
const cors = require("cors");
const logger = require("morgan");
const engine = require("ejs-mate");
const config = require("config"); //Simplified config import


connectDB();

module.exports = class MnemoniacApp extends express {
  constructor() {
    super();
    this.engine("ejs", engine);
    this.set("view engine", "ejs");
    this.set("views", __dirname + "/views");
    this.use(logger(...config.get("logging"))); //Simplified logger config
    this.use(favicon(__dirname + "/public/images/card.ico"));
    this.use(bodyParser.urlencoded({ extended: false }));
    this.use(bodyParser.json());
    this.use(cors());
    this.use(routes);
    this.use(errorsHandler);
    this.use(invalidPathHandler);
  }
};
