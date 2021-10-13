const express = require("express");

const { getQuiz, postQuiz, addQuestion } = require("../controllers/quiz");

const router = express.Router();

router.get("/:quiz_id", getQuiz);
router.post("/", postQuiz);
router.post("/:quiz_id/:question_id", addQuestion);

module.exports = router;
