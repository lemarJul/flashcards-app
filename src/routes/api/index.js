const router = require("express").Router();

router.get("/", (req, res) => {
  res.render("pages/api", { stack: ["Node.js", "Express", "Sequelize"] });
});

require("./auth.routes.js")(router);
require("./flashcards.routes.js")(router);
require("./users.routes.js")(router);
require("./categories.routes.js")(router);

router.use((err, req, res, next) => {
  next(err);
});

module.exports = router;
