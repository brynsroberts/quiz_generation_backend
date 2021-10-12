// source: https://www.youtube.com/watch?v=DyqVqaf1KnA

const ApiError = require("./error");

const errorHandler = (err, req, res, next) => {
  if (err instanceof ApiError) {
    res.status(err.code).json({ Error: err.message });
    return;
  }

  res.status(500).json({ Error: "internal error" });
};

module.exports = errorHandler;
