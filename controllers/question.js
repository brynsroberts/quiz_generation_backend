const { getSingleQuestion, postSingleQuestion } = require("../models/question");

const getQuestion = async (req, res, next) => {
  // get question from database and return JSON object
  const question = await getSingleQuestion(req.params.id);
  const accepts = req.accepts()[0];

  // send back application/json
  res.status(200).json({
    id: req.params.id,
    ...question[0],

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

module.exports = {
  getQuestion,
  postQuestion,
};
