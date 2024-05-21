const userService = require("./user.service");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Api400Error, Api404Error } = require("../errors/api-errors");

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
};