const path = require("path");

exports.getReportsPage = (req, res) => {
  res.sendFile(path.join(__dirname, "../", "public", "views", "reports.html"));
};