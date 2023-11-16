const express = require("express");
const router = express.Router();
const loginController = require("../controllers/loginController");

router.post("/login", loginController.postUserLogin);
router.get("/login", loginController.getLoginPage);
module.exports = router; 