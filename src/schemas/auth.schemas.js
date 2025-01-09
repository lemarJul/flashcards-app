/**
 * Joi validation schemas for login and registration.
 * Defines schemas for validating user login and registration requests using Joi.
 *
 * @module schemas
 */
const Joi = require("joi");

const password = Joi.string().required();
const email = Joi.string().email().required();
const username = Joi.string().min(3).max(30).required();

module.exports = {
  login: Joi.object({
    email,
    password,
  }),
  register: Joi.object({
    username,
    email,
    password,
  }),
};
