const express = require("express");

const { getEmployee, postEmployee, deleteEmployee } = require("../controllers/employee");

const router = express.Router();

router.get("/:employee_id", getEmployee);
router.post("/", postEmployee);
router.delete("/:employee_id", deleteEmployee);

module.exports = router;
