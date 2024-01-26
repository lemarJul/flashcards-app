const { Flashcard } = require("../../db");

module.exports.views = {
  new: (req, res) => {
    return res.render("pages/new-flashcard", { title: "New flashcard" });
  },
  list: (req, res) => {
    Flashcard.findAll({}).then((flashcards) =>
      res.render("pages/flashcards", {
        flashcards,
      })
    );
  },
  show: (req, res) => {
    Flashcard.findByPk(req.params.id).then((flashcard) =>
      res.render("pages/single-flashcard", {
        flashcard,
      })
    );
  },
};

module.exports.create = (req, res) => {
  const { question, answer, category } = req.body;
  Flashcard.create({ question, answer, category }).then((flashcard) =>
    res.redirect(`/flashcards/${flashcard.id}`)
  );
};

module.exports.delete = (req, res) => {
  Flashcard.destroy({ where: { id: req.params.id } })
    .then(() => res.redirect("/dashboard"))
    .catch((error) => {
      res.status(500).json({
        message: "Error in deleting flashcard",
        data: error.message,
      });
    });
};
