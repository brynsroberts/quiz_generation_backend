const {
  getSingleEmployee,
  postSingleEmployee,
  deleteSingleEmployee,
} = require("../models/employee");

const getEmployee = async (req, res, next) => {
  // get question from database and return JSON object
  const employee = await getSingleEmployee(req.params.employee_id);

  // send back application/json
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
};

const postEmployee = async (req, res, next) => {
  // get values from request body
  const { name, email } = req.body;

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
};

const deleteEmployee = async (req, res, next) => {

  // delete all quizes associated with that employee
  

  // delete boat from database and return 204
  await deleteSingleEmployee(req.params.employee_id);
  res.status(204).end();
};

module.exports = {
  getEmployee,
  postEmployee,
  deleteEmployee,
};
