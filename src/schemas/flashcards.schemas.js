const Joi = require("joi");

const questionSchema = Joi.string().required();
const answerSchema = Joi.string().required();
const categorySchema = Joi.string().required();

const createSchema = Joi.object({
  question: questionSchema,
  answer: answerSchema,
  category: categorySchema,
});

const updateSchema = Joi.object({
  question: questionSchema,
  answer: answerSchema,
  category: categorySchema,
});

const reviewsSchema = Joi.object({
  flashcards: Joi.array().items(
    Joi.object({
      id: Joi.number().integer().required(),
      isSuccessful: Joi.boolean().allow(null),
    })
  ),
});

module.exports = {
  create: createSchema,
  reviews: reviewsSchema,
  update: updateSchema,
};
