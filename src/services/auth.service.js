require("dotenv").config();
const userService = require("./user.service");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Api400Error, Api404Error } = require("../errors/api-errors");
const mailService = require("./mail.service");

// function signup() {}

async function login(email, password) {
  const user = await userService.findOne({ email });
  if (!user)
    throw new Api404Error(
      `Requested user with username ${username} doesn't exist`
    );

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) throw new Api400Error("Invalid password");

  return {
    token: createToken(user.id),
    user,
  };
}

async function register(username, email, password) {
  const user = await userService.create({ username, email, password });
  await mailService.sendConfirmationEmail(user);
  return {
    token: createToken(user.id),
    user,
  };
}

// function logout() {}
// function forgotPassword() {}
// function resetPassword() {}
// function confirmEmail() {}
// function changePassword() {}
// function changeEmail() {}

function createToken(id) {
  return jwt.sign(
    {
      id,
    },
    process.env.PRIVATE_KEY,
    {
      expiresIn: "1h",
    }
  );
}

async function authUser(token, userId) {
  const decodedToken = await verifyToken(token, process.env.PRIVATE_KEY);
  if (decodedToken.id !== userId) throw new Api400Error("Invalid user ID");
}

async function confirmUserEmail(confirmationToken) {
  const user = await userService.findOne({ confirmationToken });
  if (!user) throw new Api404Error("Invalid confirmation token");
  if (user.emailConfirmed) throw new Api400Error("Email already confirmed");
  if (user.confirmationTokenExpires < Date.now())
    throw new Api400Error("Confirmation token has expired");

  user.emailConfirmed = true;
  await user.save();
  return user;
}

function verifyToken(token, privateKey) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, privateKey, (error, decodedToken) => {
      if (error) reject(error);
      resolve(decodedToken);
    });
  });
}

module.exports = {
  login,
  register,
  authUser,
  confirmUserEmail,
};
