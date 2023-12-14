const express = require("express");
const router = express.Router();
const userAuthentication = require("../middleware/auth");
const reportsController = require("../controllers/reportsController");

router.get("/getReportsPage", reportsController.getReportsPage);

router.post(
  "/dailyReports",
  userAuthentication,
  reportsController.dailyReports
);

router.post(
  "/monthlyReports",
  userAuthentication,
  reportsController.monthlyReports
);
router.post(
  "/yearlyReports",
  userAuthentication,
  reportsController.yearlyReports
);
module.exports = router;
