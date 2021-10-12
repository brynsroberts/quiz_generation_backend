// src: https://www.npmjs.com/package/@google-cloud/datastore

const { Datastore } = require("@google-cloud/datastore");
const projectID = "cs467quizcreation";
const datastore = new Datastore({ projectID: projectID });

const QUIZ = "Quiz";

const getSingleQuiz = async (id) => {
  const key = datastore.key([QUIZ, parseInt(id, 10)]);
  const quiz = datastore.get(key);
  return quiz;
};

const postSingleQuiz = async (employee, timeLimit, question) => {
  const key = datastore.key(QUIZ);
  const newQuiz = {
    employee: employee,
    timeLimit: timeLimit,
    question: question,
  };
  await datastore.save({ key: key, data: newQuiz });
  return key;
};

module.exports = {
  getSingleQuiz,
  postSingleQuiz,
};