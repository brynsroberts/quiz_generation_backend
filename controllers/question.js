const ApiError = require("../error/error");
const {
  getSingleQuestion,
  postSingleQuestion,
  deleteSingleQuestion,
} = require("../models/question");

const getQuestion = async (req, res, next) => {
  // get question from database and return JSON object
  const question = await getSingleQuestion(req.params.question_id);

  // if question does not exist - send 404
  if (question[0] === undefined) {
    next(ApiError.notFound("No question with this question_id exists"));

    // send back application/json
  } else {
    res.status(200).json({
      id: req.params.question_id,
      ...question[0],

      // generate self URL on the spot
      self:
        req.protocol +
        "://" +
        req.get("host") +
        req.baseUrl +
        "/" +
        req.params.question_id,
    });
  }
};

const postQuestion = async (req, res, next) => {
  // get values from request body
  const { type, points, question, answer } = req.body;

  // post question to server using modal function
  const key = await postSingleQuestion(type, points, question, answer);

  // send back 201 response with values in json format
  res.status(201).json({
    id: key.id,
    type: type,
    points: points,
    question: question,
    answer: answer,

    // generate self URL on the spot
    self: req.protocol + "://" + req.get("host") + req.baseUrl + "/" + key.id,
  });
};

const deleteQuestion = async (req, res, next) => {
  // make sure question exists
  const question = await getSingleQuestion(req.params.question_id);

  // if question does not exist - send 404
  if (question[0] === undefined) {
    next(ApiError.notFound("No question with this question_id exists"));

    // else delete question - send 204
  } else {
    await deleteSingleQuestion(req.params.question_id);
    res.status(204).end();
  }
};

module.exports = {
  getQuestion,
  postQuestion,
  deleteQuestion,
};
