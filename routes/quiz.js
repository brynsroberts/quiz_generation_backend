const express = require("express");

const {
  getQuiz,
  postQuiz,
  addQuestion,
  deleteQuiz,
} = require("../controllers/quiz");

const router = express.Router();

router.get("/:quiz_id", getQuiz);
router.post("/", postQuiz);
router.post("/:quiz_id/question/:question_id", addQuestion);
router.delete("/:quiz_id", deleteQuiz);

module.exports = router;
