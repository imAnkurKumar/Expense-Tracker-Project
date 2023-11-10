const User = require("../models/userModel");
const Expense = require("../models/expenseModel");

const sequelize = require("../util/database");

const getUserLeaderboard = async (req, res) => {
  try {
    const expenses = await Expense.findAll();
    const users = await User.findAll();
    const userAggregateExpenses = {};
    expenses.forEach((expense) => {
      if (userAggregateExpenses[expense.userId]) {
        userAggregateExpenses[expense.userId] =
          userAggregateExpenses[expense.userId] + expense.amount;
      } else {
        userAggregateExpenses[expense.userId] = expense.amount;
      }
    });
    var userLeaderboardDetails = [];
    users.forEach((user) => {
      userLeaderboardDetails.push({
        name: user.name,
        total_cost: userAggregateExpenses[user.id],
      });
    });
    // console.log(userLeaderboardDetails);
    res.status(200).json(userLeaderboardDetails);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

module.exports = { getUserLeaderboard };
