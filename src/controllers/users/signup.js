const { User } = require("../../db");
const { Api400Error } = require("../../errors/api-errors");
const baseCreate = require("../base-controller/create.js");
const createUser = baseCreate("user", User);
const sendEmailConfirmation = require("../mail/send-email-confirmation.js");

module.exports = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const isMissing = !username || !password || !email;

    if (isMissing)
      throw new Api400Error("Please provide username, email and password");

    createUser(req, res, next).then(() => {
      sendEmailConfirmation(req, res, next);
    });
    
  } catch (error) {
    next(error);
  }
};
