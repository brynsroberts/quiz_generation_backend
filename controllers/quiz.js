const { getSingleQuiz, postSingleQuiz } = require("../models/quiz");

const getQuiz = async (req, res, next) => {
  // get quiz from database and return JSON object
  const quiz = await getSingleQuiz(req.params.id);
  const accepts = req.accepts()[0];

  // send back application/json
  res.status(200).json({
    id: req.params.id,
    ...quiz[0],

    // generate self URL on the spot
    self:
      req.protocol +
      "://" +
      req.get("host") +
      req.baseUrl +
      "/" +
      req.params.id,
  });
};

const postQuiz = async (req, res, next) => {
  // get values from request body
  const { employee, timeLimit, question } = req.body;

  // post question to server using modal function
  const key = await postSingleQuiz(employee, timeLimit, question);

  // send back 201 response with values in json format
  res.status(201).json({
    id: key.id,
    employee: employee,
    timeLimit: timeLimit,
    question: question,

    // generate self URL on the spot
    self: req.protocol + "://" + req.get("host") + req.baseUrl + "/" + key.id,
  });
};

module.exports = {
  getQuiz,
  postQuiz,
};
