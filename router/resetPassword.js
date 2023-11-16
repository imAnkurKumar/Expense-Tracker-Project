const express = require("express");
const router = express.Router();

const resetPasswordController = require("../controllers/resetPassword");

router.post("/forgotpassword", resetPasswordController.sendEmail);

module.exports = router;
