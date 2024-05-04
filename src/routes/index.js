const express = require("express");
const appRouter = require("./app");
const apiRouter = require("./api");

const router = express
  .Router()
  .use(express.static("public")) // serve static files from public folder
  .use(appRouter) // use appRouter for all routes
  .use("/api", apiRouter); // use apiRouter for all routes starting with /api

module.exports = router;
