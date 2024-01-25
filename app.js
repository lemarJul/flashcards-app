//node_modules
const express = require("express"),
  bodyParser = require("body-parser"),
  favicon = require("serve-favicon"),
  cors = require("cors"),
  logger = require("morgan"),
  path = require("path"),
  fs = require("fs"),
  // modules
  routes = require("./src/routes"),
  { isDevENV } = require("./src/utils"),
  // files
  accessLogStream = fs.createWriteStream(path.join(__dirname, "access.log"), {
    flags: "a",
  }),
  // config
  logConfig = isDevENV ? ["dev"] : ["combined", { stream: accessLogStream }]
  const engine = require("ejs-mate")

const errorsHandler = require("./src/errors/errors-handler");
const invalidPathHandler = require("./src/errors/invalid-path-handler");

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
