const Joi = require("joi");
const { Schema } = require("mongoose");

const contactAddSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
  favorite: Joi.boolean(),
});
// const contactUpdSchema = Joi.object().min(1);
const contactUpdSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string(),
  phone: Joi.string(),
  favorite: Joi.boolean(),
}).or("name", "email", "phone", "favorite");

const updFavorSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

const contactMongoSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false, timestamps: true }
);

module.exports = {
  contactAddSchema,
  contactUpdSchema,
  updFavorSchema,
  contactMongoSchema,
};
