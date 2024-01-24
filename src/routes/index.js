const express = require("express");
const appRouter = require('./app');
const apiRouter = require('./api');

console.log(__dirname + "/public");
module.exports = express
  .Router()
  .use(express.static("public"))
  .use(appRouter)
  .use("/api", apiRouter)

