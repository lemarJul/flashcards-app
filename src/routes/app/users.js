const { Flashcard } = require("../../db");

module.exports.signup = (req, res) => {
  return res.render("pages/signup", { title: "signup" });
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

module.exports.dashboard = (req, res) => {
  return res.render("dashboard", { title: "Dashboard" });
};

module.exports.views = {
  login: (req, res) => {
    return res.render("pages/login");
  },
  forgotPassword: (req, res) => {
    return res.render("pages/forgot-password");
  },
  training: (req, res) => {
    Flashcard.findAll({
      limit: 5,
      where: {
        // category : req.query.category
      },
    }).then((flashcards) =>
      res.render("pages/training", {
        questions: JSON.stringify(flashcards),
      })
    );
  },
};
