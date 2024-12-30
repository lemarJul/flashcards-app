// controllers & middlewares
const config = require("../../app.config");
const { parseSemVer } = require("../utils/utils");
const Auth = require("../controllers/auth.controller");
const Flashcard = require("../controllers/flashcards/flashcards.controller");
const User = require("../controllers/users");
const mwAuth = require("../middlewares/auth.middlewares");
const { attachFlashcardToRequest } = require("../middlewares/flashcards.middlewares");
const { attachUserToRequest } = require("../middlewares/users.middlewares");

const version = parseSemVer(config.app.version)?.major;

const PONG = (req, res) => {
  res.json({ message: `pong${req.ping ? " with param " + req.ping : ""}` });
};
const PING_PARAM = (req, res, next, id) => {
  req.ping = id;
  next();
};

module.exports = {
  // params
  ping: { param: PING_PARAM },
  [Flashcard.name]: { param: attachFlashcardToRequest },
  [User.name]: { param: attachUserToRequest },

  // routes
  "/api": {
    ["/v" + version]: {
      "/ping": {
        get: PONG,
        "/:ping": {
          get: PONG,
        },
      },
      "/auth": {
        "/confirm-email/:token": {
          get: Auth.confirmUserEmail,
        },
        "/login": {
          post: Auth.login,
        },
        "/register": {
          post: Auth.register,
        },
        "/logout": {
          post: [mwAuth.user, Auth.logout],
        }, //Note: This line is different.  See explanation below.
      },
      "/*": {
        all: mwAuth.user,
      },
      "/flashcards": {
        get: Flashcard.findAll,
        post: Flashcard.create,
        "/:flashcard": {
          get: Flashcard.findById,
          put: Flashcard.updateById,
          delete: Flashcard.deleteById,
        },
        "/review": {
          post: Flashcard.processFlashcardReviews,
        },
      },
      "/users": {
        "/:user": {
          get: User.findById,
          put: User.updateById,
          delete: User.deleteById,
        },
      },
    },
  },
};
