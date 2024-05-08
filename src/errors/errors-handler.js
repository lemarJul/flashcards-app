const BaseError = require("./base-error");
const { ValidationError } = require("sequelize");

module.exports = (err, req, res, next) => {
  console.log("=> error-handler.js:");
  //res.header("Content-Type", "application/json");
  delete err.isOperational;

  // Malformed JSON
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ message: "Invalid JSON payload received." });
  }
  
  if(err instanceof ValidationError) {
    return res.status(400).json({ message: err.message, data: err });
  }

  if (err instanceof BaseError) {
    return res.status(err.statusCode).json({ message: err.message, data: err });
  }
  if (err.name === "TokenExpiredError") {
    return res.status(401).json({ message: err.message, data: err });
  }

  // Sequelize errors
  const status = err.statusCode || 500;
  const message = err.name ? `${err.message}: ${err.name}` : err.message;
  const data = err.data || err.errors || err;
  console.error(err);

  res.status(status).json({ message, data });
};
