const { User } = require("../../db").sequelize.models;
const { Api404Error } = require("../../errors/api-errors.js");
const BaseError = require("../../errors/base-error");

module.exports = async (req, res, next) => {
  try {
    const { token } = req.query;

    const user = await User.findOne({ where: { confirmationToken: token } });

    if (!user) throw new Api404Error("Invalid token");

    if (user.emailConfirmed)
      return res.render("pages/email-confirmation", { user, alreadyConfirmed: true });

    if (user.confirmationTokenExpires < Date.now()) {
      // If the token has expired, show an error message
      throw new Error("Confirmation token has expired.");
    }

    user.emailConfirmed = true;
    await user.save();

    res.render("pages/email-confirmation", { user });
  } catch (error) {
    if (!error instanceof BaseError)
      error.message = `Error in creating new user: ${error.message}`;
    next(error);
  }
};
