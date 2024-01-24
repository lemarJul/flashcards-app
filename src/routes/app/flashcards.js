const { Flashcard } = require("../../db");

module.exports.new = (req, res) => {
  return res.render("new-flashcard", { title: "New flashcard" });
};

module.exports.list = (req, res) => {
  Flashcard.findAll({}).then((flashcards) =>
    res.render("flashcards", {
      flashcards,
    })
  );
};

module.exports.show = (req, res) => {
  Flashcard.findByPk(req.params.id).then((flashcard) =>
    res.render("flashcard", {
      flashcard,
    })
  );
};

module.exports.create = (req, res) => {
  const { question, answer, category } = req.body;
  Flashcard.create({ question, answer, category }).then((flashcard) =>
    res.redirect(`/flashcards/${flashcard.id}`)
  );
};

module.exports.delete = (req, res) => {
  Flashcard.destroy({ where: { id: req.params.id } })
    .then(() =>
      res.redirect('/dashboard')
    )
    .catch((error) => {
      res.status(500).json({
        message: "Error in deleting flashcard",
        data: error.message,
      });
    });
};
