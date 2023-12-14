const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const Download = sequelize.define("download", {
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  fileURL: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
  },
  downloadDate: {
    type: Sequelize.DATE,
    allowNull: false,
  },
});

module.exports = Download;
