const express = require("express");
const router = express.Router();
const loginController = require("../controllers/loginController");

router.post("/", loginController.postUserLogin);
router.get("/", loginController.getLoginPage);
module.exports = router;