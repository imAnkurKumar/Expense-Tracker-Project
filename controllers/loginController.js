const path = require("path");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

function generateAccessToken(id, email, isPremiumUser) {
  return jwt.sign(
    { userId: id, email: email, isPremiumUser },
    process.env.TOKEN_SECRET
  );
}

const getLoginPage = (req, res, next) => {
  res.sendFile(path.join(__dirname, "../", "public", "views", "login.html"));
};

const postUserLogin = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = await User.findOne({ where: { email } });
    // console.log("This is user", user);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = generateAccessToken(user.id, user.email, user.isPremiumUser);

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { generateAccessToken, postUserLogin, getLoginPage };
