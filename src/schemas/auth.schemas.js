/**
 * Joi validation schemas for login and registration.
 * Defines schemas for validating user login and registration requests using Joi.
 *
 * @module schemas
 */
const Joi = require("joi");

const passwordSchema = Joi.string().required();
const emailSchema = Joi.string().email().required();

const loginSchema = Joi.object({
  email: emailSchema,
  password: passwordSchema,
});

const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: emailSchema,
  password: passwordSchema,
});

module.exports = {
  login: loginSchema,
  register: registerSchema,
};
