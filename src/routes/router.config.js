// controllers & middlewares
const Auth = require("../controllers/auth.controller"),
  Flashcard = require("../controllers/flashcards"),
  User = require("../controllers/users"),
  mwAuth = require("../middlewares/auth.middlewares"),
  { attachFlashcardToRequest } = require("../middlewares/flashcards.middlewares"),
  { attachUserToRequest } = require("../middlewares/users.middlewares");

const PONG = (req, res) => {
  res.json({ message: `pong${req.ping ? " with param " + req.ping : ""}` });
};
const PING_PARAM = (req, res, next, id) => {
  req.ping = id;
  next();
};

exports.routeConfig = {
  // params
  ping: { param: PING_PARAM },
  flashcard: { param: attachFlashcardToRequest },
  user: { param: attachUserToRequest },

  // routes
  "/api": {
    "/ping": {
      get: PONG,
    },
    "/ping/:ping": {
      get: PONG,
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
};
