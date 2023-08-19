const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  "expense_tracker_project",
  "root",
  "T#9758@QLPH",
  {
    dialect: "mysql",
    host: "localhost",
  }
);
module.exports = sequelize;
