const { Flashcard } = require("../../db");

module.exports.signup = (req, res) => {
  return res.render("signup", { title: "signup" });
};

module.exports.login = (req, res) => {
  return res.render("login");
};

module.exports.submit = (req, res) => {
  const { username, password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    res
      .status(400)
      .json({ error: "Password and confirmation password do not match" });
  } else {
    const user = { username, password };
    res.status(201).json({ message: "User created successfully", data: user });
  }
};

module.exports.training = (req, res) => {
  Flashcard.findAll({
    limit: 5,
    where: {
      // category : req.query.category
    },
  }).then((flashcards) =>
    res.render("training", {
      questions: JSON.stringify(flashcards),
    })
  );
};
module.exports.dashboard = (req, res) => {
  return res.render("dashboard", { title: "Dashboard" });
};

