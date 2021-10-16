const express = require("express");

const { getEmployee, postEmployee, addQuizToEmployee } = require("../controllers/employee");

const router = express.Router();

router.get("/:employee_id", getEmployee);
router.post("/", postEmployee);

module.exports = router;
