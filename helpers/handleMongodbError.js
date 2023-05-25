const handleMongodbError = (error, data, next) => {
  error.status = 400;
  console.log("handleError");
  next();
};

module.exports = handleMongodbError;
