const { model } = require("mongoose");
const { handleMongodbError } = require("../helpers");
const { userMongoSchema } = require("../validationSchemas/validationSchemas");

userMongoSchema.post("save", handleMongodbError);

const User = model("user", userMongoSchema);

module.exports = User;
