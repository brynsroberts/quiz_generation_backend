const express = require("express");

const { getQuiz, postQuiz } = require("../controllers/quiz");

const router = express.Router();

router.get("/:id", getQuiz);
router.post("/", postQuiz);

module.exports = router;
