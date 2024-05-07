const { User } = require("../../db/index.js").sequelize.models;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Api400Error, Api404Error } = require("../../errors/api-errors.js");
const BaseError = require("../../errors/base-error.js");

module.exports = async (req, res, next) => {

  try {
    const { username, password } = req.body;
    if (!username || !password) {
      throw new Api400Error("Please provide a username and a password");
    }

    const user = await User.findOne({
      where: {
        username: req.body.username,
      },
    });

    if (!user)
      throw new Api404Error(
        `Requested user with username ${req.body.username} doesn't exist`
      );

    const isValid = await bcrypt.compare(req.body.password, user.password);

    if (!isValid) throw new Api400Error("Invalid password");

    res.json({
      message: "Successfully logged in",
      data: user,
      token: jwt.sign(
        {
          id: user.id,
        },
        process.env.PRIVATE_KEY,
        {
          expiresIn: "1h",
        }
      ),
    });
  } catch (error) {
    if (!(error instanceof BaseError)) error.name = "Error in logging in";
    next(error);
  }
};
