const { model } = require("mongoose");
const { handleMongodbError } = require("../helpers");
const {
  contactMongoSchema,
} = require("../validationSchemas/validationSchemas");

contactMongoSchema.post("save", handleMongodbError);

const Contact = model("contact", contactMongoSchema);

module.exports = Contact;
