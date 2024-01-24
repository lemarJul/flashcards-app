const jwt = require("jsonwebtoken");
const { Api401Error } = require("../errors/api-errors.js");

module.exports = (req, res, next) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    return next(new Api401Error("No token provided"));
  }

  const token = authorizationHeader.split(" ")[1];
  jwt.verify(token, process.env.PRIVATE_KEY, (error, decodedToken) => {
    if (error) return next(error);

    const userId = decodedToken.id;
    const tokenNoMatchUser = req.body.userId && req.body.userId !== userId;
    if (tokenNoMatchUser) return next(new Api401Error("Invalid user ID"));
    else {
      req.userId = userId;
      next();
    }
  });
};
