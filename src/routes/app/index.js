const express = require("express");
const users = require("./users.js");
const flashcards = require("./flashcards.js");
const confirmEmail = require("../../controllers/users/confirm-email.js");
const clearNotConfirmed = require("../../controllers/users/clear-not-confirmed.js");
const loadPartialsRoutes = require("./partials-tester.js");

const router = express
  .Router()
  .get("/", (req, res) => {
    res.render("pages/home");
  })
  .get("/about", (req, res) => res.render("pages/about"))
  .get("/upcoming", (req, res) => res.render("pages/upcoming"))
  .get("/dashboard", (req, res) => res.render("pages/dashboard"))
  .get("/profile", (req, res) => res.render("pages/profile"))
  .get("/discover", (req, res) => res.render("pages/discover"))
  .get("/test/flashcard", (req, res) => res.render("partials/flashcard"))
  // Users
  .get("/signup", users.signup)
  .get("/login", users.views.login)
  .get("/clear-not-confirmed", clearNotConfirmed)
  .post("/signup", users.submit)
  .get("/training", users.views.training)
  .get("/confirm-email", confirmEmail)
  .get("/forgot", users.views.forgotPassword)
  // Flashcards
  .get("/flashcards", flashcards.views.list)
  .get("/flashcards/new", flashcards.views.new)
  .get("/flashcards/:id", flashcards.views.show)
  .post("/flashcards", flashcards.create)
  .delete("/flashcards/:id", flashcards.delete);
  //partials testing
  if (process.env.NODE_ENV === "development") {
    loadPartialsRoutes(router);
  }



module.exports = router;
