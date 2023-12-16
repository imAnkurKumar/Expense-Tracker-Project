const path = require("path");
const Expense = require("../models/expenseModel");
const User = require("../models/userModel");
const sequelize = require("../util/database");
const S3services = require("../services/S3services");
const Download = require("../models/downloadModel");

const getHomePage = (req, res) => {
  res.sendFile(path.join(__dirname, "../", "public", "views", "homePage.html"));
};

const downloadExpense = async (req, res) => {
  try {
    const expenses = await Expense.findAll({ where: { userId: req.user.id } });
    console.log("expenses", expenses);
    const stringifiedExpenses = JSON.stringify(expenses);

    const userId = req.user.id;
    const filename = `Expense${userId}/${new Date()}.txt`;
    const fileURL = await S3services.uploadToS3(stringifiedExpenses, filename);

    const result = await Download.create({
      userId: req.user.id,
      fileURL: fileURL,
      downloadDate: new Date(),
    });
    res.status(200).json({ fileURL, success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ fileURL: "", success: false, err: err });
  }
};
const downloadDate = async (req, res) => {
  try {
    const downloadHistory = await Download.findAll({
      where: { userId: req.user.id },
      attributes: ["fileURL", "downloadDate"],
    });
    res.status(200).json(downloadHistory);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error in fetching data" });
  }
};
const getAllExpenses = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = 5;
    const offset = (page - 1) * limit;

    const totalExpenses = await Expense.count({
      where: { userId: req.user.id },
    });
    console.log("totalExpenses..", totalExpenses);

    const expenses = await Expense.findAll({
      where: { userId: req.user.id },
      offset: offset,
      limit: limit,
    });
    
    console.log(expenses);
    res.json({ expenses, totalExpenses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const addExpense = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { amount, description, category } = req.body;
    const result = await Expense.create(
      {
        amount: amount,
        description: description,
        category: category,
        userId: req.user.id, // Include the userId associated with the currently logged-in user
      },
      { transaction: t }
    );

    const totalExpense = Number(req.user.totalExpenses) + Number(amount);
    console.log("totalExpense", totalExpense);
    console.log("result", result);

    const updateUser = await User.update(
      { totalExpenses: totalExpense },
      { where: { id: req.user.id }, transaction: t }
    );
    await t.commit();
    res.status(200).json({ message: "Expense added successfully" });
  } catch (err) {
    await t.rollback();
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteExpense = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const expenseId = req.params.id; // Get the expense ID from the request params
    const expense = await Expense.findOne({
      where: { id: expenseId, userId: req.user.id }, // Check both ID and userId
    });

    if (!expense) {
      await t.rollback();
      return res.status(404).json({ message: "Expense not found" });
    }

    const deletedAmount = expense.amount;
    await expense.destroy({ transaction: t }); // Delete the expense
    const updateUser = await User.update(
      {
        totalExpenses: Number(req.user.totalExpenses) - Number(deletedAmount),
      },
      {
        where: {
          id: req.user.id,
        },
        transaction: t,
      }
    );

    await t.commit();
    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (err) {
    await t.rollback();
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getAllExpenses,
  deleteExpense,
  addExpense,
  getHomePage,
  downloadExpense,
  downloadDate,
};
