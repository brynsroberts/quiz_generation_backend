// src: https://www.npmjs.com/package/@google-cloud/datastore

const { Datastore } = require("@google-cloud/datastore");
const projectID = "cs467quizcreation";
const datastore = new Datastore({ projectID: projectID });

const QUESTION = "Question";

const getSingleQuestion = async (id) => {
  const key = datastore.key([QUESTION, parseInt(id, 10)]);
  const question = datastore.get(key);
  return question;
};

const postSingleQuestion = async (type, points, question, answer) => {
  const key = datastore.key(QUESTION);
  const newQuestion = {
    type: type,
    points: points,
    question: question,
    answer: answer,
  };
  await datastore.save({ key: key, data: newQuestion });
  return key;
};

module.exports = {
  getSingleQuestion,
  postSingleQuestion,
};
