const User = require("../models/userModel");
const Expense = require("../models/expenseModel");

const sequelize = require("../util/database");

const getUserLeaderboard = async (req, res) => {
  try {
    const leaderboardOfUsers = await User.findAll({
      attributes: [
        "id",
        "name",
        [sequelize.fn("sum", sequelize.col("amount")), "total_cost"],
      ],
      include: [{ model: Expense, attributes: [] }],
      group: ["user.id"],
      order: [["total_cost", "DESC"]],
    });

    console.log("LeaderboardOfUsers--->>>", leaderboardOfUsers);
    res.status(200).json(leaderboardOfUsers);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

module.exports = { getUserLeaderboard };
