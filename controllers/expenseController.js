const path = require("path");
const Expense = require("../models/expenseModel");

exports.getHomePage = (req, res, next) => {
  res.sendFile(path.join(__dirname, "../", "public", "views", "homePage.html"));
};

exports.getAllExpenses = async (req, res, next) => {
  try {
    const expenses = await Expense.findAll();
    res.json(expenses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
// exports.addExpense = async (req, res, next) => {
//   const { amount, description, category } = req.body;

//   try {
//     const result = await Expense.create({
//       amount: amount,
//       description: description,
//       category: category,
//     });
//     res.redirect("/homePage");
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

exports.addExpense = async (req, res, next) => {
  const { amount, description, category } = req.body;

  try {
    const result = await Expense.create({
      amount: amount,
      description: description,
      category: category,
    });
    res.status(200).json({ message: "Expense added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteExpense = async (req, res, next) => {
  const expenseId = req.params.id; // Get the expense ID from the request params

  try {
    const expense = await Expense.findByPk(expenseId); // Find the expense by ID
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    await expense.destroy(); // Delete the expense
    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
