const express = require("express");

const {
  getQuestion,
  postQuestion,
  deleteQuestion,
} = require("../controllers/question");

const router = express.Router();

router.get("/:question_id", getQuestion);
router.post("/", postQuestion);
router.delete("/:question_id", deleteQuestion);

module.exports = router;
