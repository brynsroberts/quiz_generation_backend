const axios = require("axios");

const ApiError = require("../error/error");
const {
  getSingleEmployee,
  postSingleEmployee,
  deleteSingleEmployee,
} = require("../models/employee");
const { getSingleQuiz, deleteSingleQuiz } = require("../models/quiz");
const { deleteSingleQuestion } = require("../models/question");

const getEmployee = async (req, res, next) => {
  // get question from database and return JSON object
  const employee = await getSingleEmployee(req.params.employee_id);

  // if employee does not exist - send 404
  if (employee[0] === undefined) {
    next(ApiError.notFound("No employee with this employee_id exists"));

    // send back application/json
  } else {
    res.status(200).json({
      id: req.params.employee_id,
      ...employee[0],

      // generate self URL on the spot
      self:
        req.protocol +
        "://" +
        req.get("host") +
        req.baseUrl +
        "/" +
        req.params.employee_id,
    });
  }
};

const postEmployee = async (req, res, next) => {
  // get values from request body
  const { name, email } = req.body;

  // request must contain name and email attributes
  if (name === undefined) {
    next(ApiError.badRequest("Request body is missing name attribute"));
  } else if (email === undefined) {
    next(ApiError.badRequest("Request body is missing email attribute"));
  }
  // make POST request
  else {
    // post question to server using modal function
    const key = await postSingleEmployee(name, email);

    // send back 201 response with values in json format
    res.status(201).json({
      id: key.id,
      name: name,
      email: email,
      quiz: [],

      // generate self URL on the spot
      self: req.protocol + "://" + req.get("host") + req.baseUrl + "/" + key.id,
    });
  }
};

const deleteEmployee = async (req, res, next) => {
  // delete all quizes associated with that employee
  // need to do this manually
  const employee = await getSingleEmployee(req.params.employee_id);

  // if employee does not exist - send 404
  if (employee[0] === undefined) {
    next(ApiError.notFound("No employee with this employee_id exists"));

    // delete employee
  } else {
    // delete all quizes stored by employee
    // iterate through quizes in the employee and delete each question
    // use for loop to not get await problems using forEach loop
    for (let i = 0; i < employee[0]["quiz"].length; i++) {
      // get the current quiz id
      let quiz_id = employee[0]["quiz"][i]["quiz_id"];
      const quiz = await getSingleQuiz(quiz_id);

      // iterate through each question in the quiz and delete the question
      for (let j = 0; j < quiz[0]["question"].length; j++) {
        await deleteSingleQuestion(quiz[0]["question"][j]["id"]);
      }

      // delete the quiz
      await deleteSingleQuiz(quiz_id);
    }

    // delete quiz from database and return 204
    await deleteSingleEmployee(req.params.employee_id);
    res.status(204).end();
  }
};

module.exports = {
  getEmployee,
  postEmployee,
  deleteEmployee,
};
