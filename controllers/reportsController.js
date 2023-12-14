const path = require("path");
const Expense = require("../models/expenseModel");
const { Op } = require("sequelize");

exports.getReportsPage = (req, res) => {
  res.sendFile(path.join(__dirname, "../", "public", "views", "reports.html"));
};

exports.dailyReports = async (req, res) => {
  try {
    const dateFromFrontend = req.body.date;
    console.log("Date from frontend>>>", dateFromFrontend);

    const startDate = new Date(`${dateFromFrontend} 00:00:00`);
    const endDate = new Date(`${dateFromFrontend} 23:59:59`);

    const expenses = await Expense.findAll({
      where: {
        createdAt: {
          [Op.between]: [startDate, endDate],
        },
        userId: req.user.id,
      },
    });

    if (!expenses || expenses.length === 0) {
      return res.status(401).json({ msg: "No expenses found" });
    }

    console.log(expenses);
    res.status(200).json(expenses);
  } catch (err) {
    console.error("This is error>> ", err.message);
    res.status(500).send("Server error");
  }
};

exports.monthlyReports = async (req, res) => {
  try {
    const monthFromFrontend = req.body.month;
    console.log("Month from frontend>>>", monthFromFrontend);

    const startDate = new Date(`${monthFromFrontend}-01 00:00:00`);
    console.log("startDate", startDate);

    const endDate = new Date(
      new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0, 23, 59, 59)
    );

    console.log("endDate", endDate);
    const expenses = await Expense.findAll({
      where: {
        createdAt: {
          [Op.between]: [startDate, endDate],
        },
        userId: req.user.id,
      },
    });

    if (!expenses || expenses.length === 0) {
      return res.status(401).json({ msg: "No expenses found" });
    }

    // console.log(expenses);
    res.status(200).json(expenses);
  } catch (err) {
    console.error("This is error>> ", err.message);
    res.status(500).send("Server error");
  }
};

exports.yearlyReports = async (req, res) => {
  try {
    const yearFromFrontend = req.body.year;
    console.log("Year from frontend>>>", yearFromFrontend);

    const startDate = new Date(`${yearFromFrontend}-01-01 00:00:00`);
    console.log("startDate", startDate);

    const endDate = new Date(
      new Date(startDate.getFullYear() + 1, 0, 0, 23, 59, 59)
    );

    console.log("endDate", endDate);

    const expenses = await Expense.findAll({
      where: {
        createdAt: {
          [Op.between]: [startDate, endDate],
        },
        userId: req.user.id,
      },
    });

    if (!expenses || expenses.length === 0) {
      return res.status(401).json({ msg: "No expenses found" });
    }

    // console.log(expenses);

    const monthlyData = [];
    for (let i = 0; i < 12; i++) {
      const monthStartDate = new Date(yearFromFrontend, i, 1, 0, 0, 0);
      const monthEndDate = new Date(yearFromFrontend, i + 1, 0, 23, 59, 59);

      const monthlyExpense = expenses.filter((expense) => {
        const expenseDate = new Date(expense.createdAt);
        return expenseDate >= monthStartDate && expenseDate <= monthEndDate;
      });

      const totalAmount = monthlyExpense.reduce(
        (accumulator, currentExpense) => accumulator + currentExpense.amount,
        0
      );

      monthlyData.push({
        month: new Date(monthStartDate).toLocaleString("default", {
          month: "long",
        }),
        amount: totalAmount,
      });
    }

    res.status(200).json(monthlyData);
  } catch (err) {
    console.error("This is error>> ", err.message);
    res.status(500).send("Server error");
  }
};
