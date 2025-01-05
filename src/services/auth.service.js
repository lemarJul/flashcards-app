const userService = require("./user.service");
const bcrypt = require("bcrypt");
const {
  Api400Error,
  Api404Error,
  Api401Error,
  Api429Error,
  Api500Error,
} = require("../errors/api-errors");
const mailService = require("./mail.service");
const { ConfirmationToken, redisClient } = require("../db");
const jwtManager = require("../modules/jwtManager")({
  privateKey: process.env.JWT_SECRET,
  redisClient,
});

async function login(email, password, ip) {
  try {
    const user = await userService.findOne({ where: { email } });
    if (!user) throw new Api404Error(`User with email ${email} not found`);

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) throw new Api400Error("Invalid password");

    return {
      accessToken: await jwtManager.createAccessToken(user.id),
      refreshToken: await jwtManager.createRefreshToken(user.id),
      // This will be set as HTTP-only cookie in the controller
      user,
    };
  } catch (error) {
    if (error.message.includes("rate limit exceeded")) {
      throw new Api429Error(error.message);
    }
    throw error;
  }
}

async function revokeTokens(accessToken, refreshToken) {
  try {
    // Revoke both tokens
    if (accessToken) {
      await jwtManager.revokeToken(accessToken);
    }
    if (refreshToken) {
      await jwtManager.revokeToken(refreshToken);
    }
    return true;
  } catch (error) {
    console.error("Error revoking tokens:", error);
    throw new Api500Error("Failed to revoke tokens");
  }
}

async function refreshAccessToken(refreshToken, ip) {
  try {
    // Verify the token and get the user ID
    const decoded = await jwtManager.verifyToken(refreshToken);

    // Mark the refresh token as used (implements token rotation)
    await jwtManager.markRefreshTokenAsUsed(refreshToken);

    // Generate new tokens (both access and refresh for token rotation)
    const [newAccessToken, newRefreshToken] = await Promise.all([
      jwtManager.createAccessToken(decoded.id),
      jwtManager.createRefreshToken(decoded.id),
    ]);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken, // New refresh token for rotation
    };
  } catch (error) {
    if (error.message.includes("rate limit exceeded")) {
      throw new Api429Error(error.message);
    }
    if (error.message.includes("Token has been revoked")) {
      throw new Api401Error("Refresh token has been revoked");
    }
    if (error.message.includes("Refresh token reuse detected")) {
      // Security event - the refresh token has been compromised
      console.error(
        "Security Alert: Refresh token reuse detected for user:",
        decoded?.id
      );
      throw new Api401Error(
        "Security alert: Token reuse detected. Please login again."
      );
    }
    if (error.message.includes("Refresh token family has been revoked")) {
      throw new Api401Error(
        "Security alert: Token family revoked. Please login again."
      );
    }
    throw new Api401Error("Invalid refresh token");
  }
}

async function register(username, email, password, validationUrl) {
  const user = await userService.create({ username, email, password });
  const confirmationToken = await user.createConfirmationToken();
  await mailService.sendConfirmationEmail(
    user,
    confirmationToken.token,
    validationUrl
  ); // Pass the token directly
  return process.env.NODE_ENV === "development" ? confirmationToken : user;
}

async function authUser(token) {
  try {
    const decodedToken = await jwtManager.verifyToken(token);
    return await userService.findById(decodedToken?.id);
  } catch (error) {
    if (error.message.includes("JWT Verification Failed")) {
      throw new Api401Error("Invalid token"); // More specific error
    } else {
      console.error("Error authenticating user:", error);
      throw new Api500Error("Authentication failed"); // Generic server error
    }
  }
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

module.exports = {
  login,
  revokeTokens,
  refreshAccessToken,
  register,
  authUser,
  confirmUserEmail,
};
