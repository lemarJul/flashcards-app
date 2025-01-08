// controllers & middlewares
const config = require("config");
const { parseSemVer } = require("../utils/utils");
const apiVersion = parseSemVer(config.get("app.version"))?.major || 1;
const Schemas = require("../schemas");

const c = {
  pong: (req, res) => {
    res.json({ message: `pong${req.ping ? " with param " + req.ping : ""}` });
  },
  Auth: require("../controllers/auth.controller"),
  Flashcard: require("../controllers/flashcards/flashcards.controller"),
  User: require("../controllers/users"),
  Category: require("../controllers/categories"),
};

const mw = {
  pongParams: (req, res, next, id) => {
    req.ping = id;
    next();
  },
  Auth: require("../middlewares/auth.middlewares"),
  FlashCard: require("../middlewares/flashcards.middlewares"),
  User: require("../middlewares/users.middlewares"),
  validateBody: require("../middlewares/validate.middleware"),
};

module.exports = {
  //* params
  ping: { param: mw.pongParams },
  [c.Flashcard.name]: {
    param: mw.FlashCard.attachFlashcardToRequest,
  },
  [c.User.name]: { param: mw.User.attachUserToRequest },

  //* routes
  "/api": {
    ["/v" + apiVersion]: {
      "/ping": {
        get: c.pong,
        "/:ping": {
          get: c.pong,
        },
      },
      "/auth": {
        "/confirm-email/:token": {
          get: c.Auth.confirmUserEmail,
        },
        "/login": {
          post: [
            mw.Auth.limiters.loginLimiter,
            mw.validateBody(Schemas.Auth.login),
            c.Auth.login,
          ],
        },
        "/register": {
          post: [mw.validateBody(Schemas.Auth.register), c.Auth.register],
        },
        "/logout": {
          post: [mw.Auth.user, c.Auth.logout],
        },
        "/refresh": {
          post: [mw.Auth.limiters.refreshTokenLimiter, c.Auth.refresh],
        },
      },
      "/*": {
        all: mw.Auth.user,
      },
      "/flashcards": {
        get: c.Flashcard.findAll,
        post: c.Flashcard.create,
        "/:flashcard": {
          get: c.Flashcard.findById,
          put: c.Flashcard.updateById,
          delete: c.Flashcard.deleteById,
        },
        "/review": {
          post: c.Flashcard.processFlashcardReviews,
        },
      },
      "/categories": {
        get: c.Category.findAll,
      },
      "/users": {
        "/:user": {
          get: c.User.findById,
          put: c.User.updateById,
          delete: c.User.deleteById,
        },
      },
    },
  },
};
