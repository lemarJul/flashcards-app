const express = require("express");
const users = require("./users.js");
const flashcards = require("./flashcards.js");
const confirmEmail = require("../../controllers/users/confirm-email.js");
const clearNotConfirmed = require("../../controllers/users/clear-not-confirmed.js");
const router = express
  .Router()
  .get("/", (req, res) => {
    res.render("home");
  })
  .get("/about", (req, res) => res.render("about"))
  .get("/upcoming", (req, res) => res.render("upcoming"))
  .get("/dashboard", (req, res) => res.render("dashboard"))
  .get("/profile", (req, res) => res.render("profile"))
  .get("/discover", (req, res) =>
    res.render("discover", {
      text : "Discover",
      flashcards: [
        {
          id: 1,
          question: "Flashcard 1",
          answer: "Description 1",
          image: "https://picsum.photos/200/300",
          tags: ["tag1", "tag2", "tag3"],
        },
        {
          id: 2,
          question: "Flashcard 2",
          answer: "Description 2",
          image: "https://picsum.photos/200/300",
          tags: ["tag1", "tag2", "tag3"],
        },
      ],
    })
  )
  .get("/flashcard-template", (req, res) => res.render("partials/flashcard"))
  // Users
  .get("/signup", users.signup)
  .get("/login", users.login)
  .get("/clear-not-confirmed", clearNotConfirmed)
  .post("/signup", users.submit)
  .get("/training", users.training)
  .get("/confirm-email", confirmEmail)
  // Flashcards
  .get("/flashcards/new", flashcards.new)
  .get("/flashcards/:id", flashcards.show)
  .post("/flashcards", flashcards.create)
  .delete("/flashcards/:id", flashcards.delete);

module.exports = router;
