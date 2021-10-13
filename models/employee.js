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
  const key = datastore.key(EMPLOYEE);
  const newEmployee = {
    name: name,
    email: email,
    quiz: [],
  };
  await datastore.save({ key: key, data: newEmployee });
  return key;
};

module.exports = {
  getSingleEmployee,
  postSingleEmployee,
};