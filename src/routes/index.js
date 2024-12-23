/**
 * Defines routes for the application using Express.js.  This code uses a recursive function to define routes based on a map of paths and handlers.  It supports multiple HTTP methods and middleware per route. Static files are served from the 'public' directory.

 * @module routes
 */
const express = require("express");
const router = require("./router.can-map")(express.Router());
const { routeConfig } = require("./router.config");

// serve static files from public folder
router.use(express.static("public"));
router.map(routeConfig);

module.exports = router;
