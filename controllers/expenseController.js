const path = require("path");
const Expense = require("../models/expenseModel");
const User = require("../models/userModel");

const getHomePage = (req, res) => {
  res.sendFile(path.join(__dirname, "../", "public", "views", "homePage.html"));
};

const getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.findAll({ where: { userId: req.user.id } });
    res.json(expenses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const addExpense = async (req, res) => {
  const { amount, description, category } = req.body;

  try {
    const result = await Expense.create({
      amount: amount,
      description: description,
      category: category,
      userId: req.user.id, // Include the userId associated with the currently logged-in user
    });

    const totalExpense = Number(req.user.totalExpenses) + Number(amount);
    console.log(totalExpense);
    console.log(result);

    const updateUser = await User.update(
      { totalExpenses: totalExpense },
      { where: { id: req.user.id } }
    );
    res.status(200).json({ message: "Expense added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteExpense = async (req, res) => {
  const expenseId = req.params.id; // Get the expense ID from the request params

  try {
    const expense = await Expense.findOne({
      where: { id: expenseId, userId: req.user.id }, // Check both ID and userId
    });

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

module.exports = { getAllExpenses, deleteExpense, addExpense, getHomePage };
