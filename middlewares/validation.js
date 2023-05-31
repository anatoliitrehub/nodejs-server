const { HttpError } = require("../helpers");

const validation = (schema) => {
  return (req, resp, next) => {
    const { error } = schema.validate(req.body);
    const missingField = error && [...error.details[0].path];
    if (error)
      next(
        HttpError(
          400,
          missingField.length
            ? `missing or incorrect required ${missingField} field`
            : "missing fields"
        )
      );

    next(error);
  };
};

module.exports = validation;
