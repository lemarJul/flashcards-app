const loadFlashcardsRoutes = require("./flashcards.js");
const loadUsersRoutes = require("./users.js");
const loadCategoriesRoutes = require("./categories.js");
const router = require("express").Router();

router.get("/", (req, res) => {
  res.render("api", { stack: ["Node.js", "Express", "Sequelize"] });
});

loadFlashcardsRoutes(router);
loadUsersRoutes(router);
loadCategoriesRoutes(router);

router.use((err, req, res, next) => {
  next(err);
});

module.exports = router;
