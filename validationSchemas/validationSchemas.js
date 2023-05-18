const Joi = require("joi");

const contactAddSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
});
const contactUpdSchema = Joi.object().min(1);

module.exports = { contactAddSchema, contactUpdSchema };
