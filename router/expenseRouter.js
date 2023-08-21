const express = require("express");
const router = express.Router();

const expenseController = require("../controllers/expenseController");

router.use(express.static("public"));

router.get("/", expenseController.getHomePage);
router.post("/addExpenses", expenseController.addExpense);
router.get("/getAllExpenses", expenseController.getAllExpenses);
router.delete("/deleteExpense/:id", expenseController.deleteExpense);

module.exports = router;
