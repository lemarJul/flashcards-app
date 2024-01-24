const userControllers = require("../../controllers/users");

const router = require("express").Router();
const auth = require("../../auth/auth.js");
const checkAdminOrSelf = require("../../auth/check-admin-or-self.js");
const sendConfirmationEmail = require("../../controllers/mail/send-email-confirmation.js");
module.exports = (app, controller = userControllers) => {
  router.param("id", controller.findById);
  router.post("/login", controller.login);
  router.post("/signup", controller.signup, sendConfirmationEmail);
  router
    .route("/users/:id")
    .all(auth, checkAdminOrSelf)
    .get(controller.sendLoadedResource)
    .delete(controller.deleteById)
    .put(controller.updateById);

  app.use(router);
};
