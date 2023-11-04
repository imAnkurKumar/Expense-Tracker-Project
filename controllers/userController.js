const path = require("path");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");

exports.getSignUpPage = (req, res, next) => {
  res.sendFile(path.join(__dirname, "../", "public", "views", "signUp.html"));
};

exports.postUserSignUp = async (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  try {
    const existingUser = await User.findOne({ where: { email: email } });

    if (existingUser) {
      console.log("User already exists:", existingUser.email);
      return res.status(400).json({ message: "User already exists" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await User.create({
      name: name,
      email: email,
      password: hashedPassword,
    });

    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
