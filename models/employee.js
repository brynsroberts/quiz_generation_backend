// src: https://www.npmjs.com/package/@google-cloud/datastore

const { Datastore } = require("@google-cloud/datastore");
const projectID = "cs467quizcreation";
const datastore = new Datastore({ projectID: projectID });

const EMPLOYEE = "Employee";

const getSingleEmployee = async (id) => {
  const key = datastore.key([EMPLOYEE, parseInt(id, 10)]);
  const employee = datastore.get(key);
  return employee;
};

const postSingleEmployee = async (name, email) => {
  // get all employees already added to the datastore
  const query = datastore.createQuery(EMPLOYEE);
  const allEmployees = await datastore.runQuery(query);

  // if an employee already has that email - return that employee without adding a new one to datastore
  for (const user of allEmployees[0]) {
    if (user["email"] === email) {
      return user[Datastore.KEY];
    }
  }

  // it is a new email - add to datastore
  const key = datastore.key(EMPLOYEE);
  const newEmployee = {
    name: name,
    email: email,
    quiz: [],
  };
  await datastore.save({ key: key, data: newEmployee });
  return key;
};

const updateEmployeeQuiz = async (name, email, quiz, id) => {
  const key = datastore.key([EMPLOYEE, parseInt(id, 10)]);
  const newEmployee = {
    name: name,
    email: email,
    quiz: quiz,
  };
  await datastore.save({ key: key, data: newEmployee });
  return key;
};

const deleteSingleEmployee = async (employee_id) => {
  const key = datastore.key([EMPLOYEE, parseInt(employee_id, 10)]);
  await datastore.delete(key);
  return;
};

module.exports = {
  getSingleEmployee,
  postSingleEmployee,
  updateEmployeeQuiz,
  deleteSingleEmployee,
};
