/**
 * Schemas for API requests related to flashcards.
 *
 * @module schemas
 */
const Joi = require("joi");

const question = Joi.string().required();
const answer = Joi.string().required();
const category = Joi.string().required();

module.exports = {
  create: Joi.object({
    question,
    answer,
    category,
  }),
  update: Joi.object({
    question,
    answer,
    category,
  }),
  reviews: Joi.object({
    flashcards: Joi.array().items(
      Joi.object({
        id: Joi.number().integer().required(),
        isSuccessful: Joi.boolean().allow(null),
      })
    ),
  }),
};
