module.exports = (err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    res.status(400).json({ message: "Invalid JSON payload received." });
  } else {
    next(err);
  }
};
