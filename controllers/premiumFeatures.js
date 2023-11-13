const User = require("../models/userModel");
const Expense = require("../models/expenseModel");

const sequelize = require("../util/database");

const getUserLeaderboard = async (req, res) => {
  try {
    const leaderboardOfUsers = await User.findAll({
      attributes: ["name", "totalExpenses"],
      order: [["totalExpenses", "DESC"]],
    });

    console.log("LeaderboardOfUsers--->>>", leaderboardOfUsers);
    res.status(200).json(leaderboardOfUsers);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

module.exports = { getUserLeaderboard };
