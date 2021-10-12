const express = require("express");

const { getQuestion, postQuestion } = require("../controllers/question");

const router = express.Router();

router.get("/:id", getQuestion);
router.post("/", postQuestion);

module.exports = router;
