const userService = require("./user.service");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// function signup() {}

async function login(username, password) {
  const user = await userService.findByName(username);
  if (!user)
    throw new Error(`Requested user with username ${username} doesn't exist`);

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    throw new Error("Invalid password");
  }
  const token = createToken(user.id);

  return token;
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
