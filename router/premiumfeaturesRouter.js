const express = require("express");
const premiumFeaturController = require("../controllers/premiumFeatures");
const userAuthentication = require("../middleware/auth");
const router = express.Router();

router.get(
  "/showLeaderBoard",
  userAuthentication,
  premiumFeaturController.getUserLeaderboard
);

module.exports = router;
