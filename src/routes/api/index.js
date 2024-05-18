const loadFlashcardsRoutes = require("./flashcards.routes.js");
const loadUsersRoutes = require("./users.routes.js");
const loadCategoriesRoutes = require("./categories.routes.js");
const router = require("express").Router();

router.get("/", (req, res) => {
  res.render("pages/api", { stack: ["Node.js", "Express", "Sequelize"] });
});

loadFlashcardsRoutes(router);
loadUsersRoutes(router);
loadCategoriesRoutes(router);

router.use((err, req, res, next) => {
  next(err);
});

module.exports = router;
