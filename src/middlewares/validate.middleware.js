/**
 * Validates the request body against a given schema using Joi.
 * @param {Object} schema - A Joi schema object.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Function} A middleware function that validates the request body.  Returns a 400 error if validation fails.
 */
const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details?.[0]?.message || "Invalid request" });
  }
  next();
};

module.exports = validate;
