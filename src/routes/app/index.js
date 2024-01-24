const express = require("express");
const users = require("./users.js");
const flashcards = require("./flashcards.js");
const confirmEmail = require("../../controllers/users/confirm-email.js");
const clearNotConfirmed = require("../../controllers/users/clear-not-confirmed.js");
const router = express
  .Router()
  .get("/", (req, res) => {
    res.render("app");
  })
  .get("/upcoming", (req, res) => res.render("upcoming"))
  .get("/dashboard", (req, res) => res.render("dashboard"))
  // Users
  .get("/signup",users.signup)
  .get("/login", users.login)
  .get("/clear-not-confirmed", clearNotConfirmed)
  .post("/signup", users.submit)
  .get("/training", users.training)
  .get('/confirm-email', confirmEmail)
  // Flashcards
  .get("/flashcards/new", flashcards.new)
  .get("/flashcards/:id", flashcards.show)
  .post("/flashcards", flashcards.create)
  .delete("/flashcards/:id", flashcards.delete);

  

module.exports = router;

