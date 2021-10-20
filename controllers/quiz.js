const axios = require("axios");

const ApiError = require("../error/error");
const {
  getSingleQuiz,
  postSingleQuiz,
  postAddQuestion,
  deleteSingleQuiz,
} = require("../models/quiz");
const { updateEmployeeQuiz, getSingleEmployee } = require("../models/employee");
const { deleteSingleQuestion } = require("../models/question");

const getQuiz = async (req, res, next) => {
  // get quiz from database and return JSON object
  const quiz = await getSingleQuiz(req.params.quiz_id);

  // if quiz does not exist - send 404
  if (quiz[0] === undefined) {
    next(ApiError.notFound("No quiz with this quiz_id exists"));

    // send back application/json
  } else {
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
  }
};

const postQuiz = async (req, res, next) => {
  // get values from request body
  const { employee, timeLimit, question } = req.body;

  // request must contain employee, timeLimit and question attributes
  if (employee === undefined) {
    next(ApiError.badRequest("Request body is missing employee attribute"));
  } else if (timeLimit === undefined) {
    next(ApiError.badRequest("Request body is missing timeLimit attribute"));
  } else if (question === undefined) {
    next(ApiError.badRequest("Request body is missing question attribute"));
  }

  // POST quiz
  else {
    // post question to server using modal function
    const key = await postSingleQuiz(employee, timeLimit, question);

    // get current employee
    const employee_self =
      req.protocol + "://" + req.get("host") + "/employee/" + employee;
    const current_employee = await axios.get(employee_self);

    // add current quiz to employee
    const quiz_self =
      req.protocol + "://" + req.get("host") + req.baseUrl + "/" + key.id;

    current_employee["data"]["quiz"].push({
      quiz_id: key.id,
      self: quiz_self,
    });

    // update quiz in database
    const { name, email, quiz } = current_employee["data"];
    await updateEmployeeQuiz(name, email, quiz, employee);

    // send back 201 response with values in json format
    res.status(201).json({
      id: key.id,
      employee: employee,
      timeLimit: timeLimit,
      question: question,

      // generate self URL on the spot
      self: quiz_self,
    });
  }
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

const deleteQuiz = async (req, res, next) => {
  // delete every question from the quiz
  // get the quiz
  const quiz = await getSingleQuiz(req.params.quiz_id);

  // if quiz does not exist - send 404
  if (quiz[0] === undefined) {
    next(ApiError.notFound("No quiz with this quiz_id exists"));

    // delete quiz
  } else {
    // iterate through questions in the quiz and delete each question
    // use for loop to not get await problems using forEach loop
    for (let i = 0; i < quiz[0]["question"].length; i++) {
      await deleteSingleQuestion(quiz[0]["question"][i]["id"]);
    }

    // remove quiz from employee
    // get employee
    const employee = await getSingleEmployee(quiz[0]["employee"]);

    //example used off stack overflow for removing element from javascript array
    // https://stackoverflow.com/questions/5767325/how-can-i-remove-a-specific-item-from-an-array
    // removed quiz from employee if quiz_id matches params quiz_id
    let i = 0;
    while (i < employee[0]["quiz"].length) {
      if (employee[0]["quiz"][i]["quiz_id"] === req.params.quiz_id) {
        employee[0]["quiz"].splice(i, 1);
      } else {
        i++;
      }
    }

    // update employee quiz
    const { name, email } = employee[0];
    await updateEmployeeQuiz(
      name,
      email,
      employee[0]["quiz"],
      quiz[0]["employee"]
    );

    // delete quiz from database and return 204
    await deleteSingleQuiz(req.params.quiz_id);
    res.status(204).end();
  }
};

module.exports = {
  getQuiz,
  postQuiz,
  addQuestion,
  deleteQuiz,
};
