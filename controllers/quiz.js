const axios = require("axios");

const {
  getSingleQuiz,
  postSingleQuiz,
  postAddQuestion,
} = require("../models/quiz");
const { addQuizToEmployee } = require("../models/employee");

const getQuiz = async (req, res, next) => {
  // get quiz from database and return JSON object
  const quiz = await getSingleQuiz(req.params.quiz_id);

  // send back application/json
  res.status(200).json({
    id: req.params.quiz_id,
    ...quiz[0],

    // generate self URL on the spot
    self:
      req.protocol +
      "://" +
      req.get("host") +
      req.baseUrl +
      "/" +
      req.params.quiz_id,
  });
};

const postQuiz = async (req, res, next) => {
  // get values from request body
  const { employee, timeLimit, question } = req.body;

  // post question to server using modal function
  const key = await postSingleQuiz(employee, timeLimit, question);

  // get current employee
  const employee_self =
    req.protocol + "://" + req.get("host") + "/employee/" + employee;
  const current_employee = await axios.get(employee_self);

  // add current quiz to employee
  const quiz_self =
    req.protocol + "://" + req.get("host") + req.baseUrl + "/" + key.id;
  console.log("quiz_self");

  current_employee["data"]["quiz"].push({
    quiz_id: key.id,
    self: quiz_self,
  });

  // update quiz in database
  const { name, email, quiz } = current_employee["data"];
  await addQuizToEmployee(name, email, quiz, employee);

  // send back 201 response with values in json format
  res.status(201).json({
    id: key.id,
    employee: employee,
    timeLimit: timeLimit,
    question: question,

    // generate self URL on the spot
    self: quiz_self,
  });
};

const addQuestion = async (req, res, next) => {
  // get current quiz from database
  const quiz = await getSingleQuiz(req.params.quiz_id);

  // get question from database
  const question_self =
    req.protocol +
    "://" +
    req.get("host") +
    "/question/" +
    req.params.question_id;
  const new_question = await axios.get(question_self);

  // add question to current quiz question array
  quiz[0]["question"].push(new_question["data"]);

  // update quiz in database
  const { employee, timeLimit, question } = quiz[0];
  const key = await postAddQuestion(
    employee,
    timeLimit,
    question,
    req.params.quiz_id
  );

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
  addQuestion,
};
