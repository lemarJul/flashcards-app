const userService = require("./user.service");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Api400Error, Api404Error } = require("../errors/api-errors");
const mailService = require("./mail.service");
const { ConfirmationToken } = require("../db/index");

async function login(email, password) {
  const user = await userService.findOne({ email });
  if (!user) throw new Api404Error(`Requested user with username ${username} doesn't exist`);

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) throw new Api400Error("Invalid password");

  return {
    token: createToken(user.id),
    user,
  };
}
async function register(username, email, password, validationUrl) {
  const user = await userService.create({ username, email, password });
  const confirmationToken = await user.createConfirmationToken();
  await mailService.sendConfirmationEmail(user, confirmationToken.token, validationUrl); // Pass the token directly
  return process.env.NODE_ENV === "development" ? confirmationToken : user;
}

function createToken(id) {
  return jwt.sign(
    {
      id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );
}

async function authUser(token) {
  const decodedToken = await verifyToken(token, process.env.JWT_SECRET);
  return await userService.findById(decodedToken.id);
}

async function confirmUserEmail(tokenFromClient) {
  try {
    const confirmationToken = await ConfirmationToken.findOne({
      where: { token: tokenFromClient },
    }); // Use tokenFromClient to query

    if (!confirmationToken) {
      throw new Api404Error("Invalid confirmation token"); // More specific error message
    }

    const user = await confirmationToken.getUser();

    if (user.emailConfirmed) {
      // Check user.emailConfirmed *after* finding the user
      throw new Api400Error("Email already confirmed");
    }

    if (confirmationToken.expiresAt < Date.now())
      throw new Api400Error("Confirmation token has expired");

    user.emailConfirmed = true;
    await user.save();
    await confirmationToken.destroy();

    return user;
  } catch (error) {
    if (error instanceof Api404Error) {
      console.error("Confirmation Error:", error.message);
      error.name = "Invalid confirmation token";
    } else {
      console.error("Error confirming email:", error);
    }
    throw error;
  }
}

//! WHY
function verifyToken(token, privateKey) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, privateKey, (error, decodedToken) => {
      if (error) {
        reject(new Error("JWT Verification Failed", error));
      } else {
        resolve(decodedToken);
      }
    });
  });
}

module.exports = {
  login,
  register,
  authUser,
  confirmUserEmail,
};
