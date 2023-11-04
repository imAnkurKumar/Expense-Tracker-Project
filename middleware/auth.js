const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const authenticate = (req, res, next) => {
  try {
    const token = req.header("Authorization");
    const user = jwt.verify(token, process.env.TOKEN_SECRET);
    console.log("user", user);
    console.log("userId >>>", user.userId);
    User.findByPk(user.userId).then((user) => {
      req.user = user;
      // console.log(req.user);
      next();
    });
  } catch (err) {
    console.log(err);
    return res.status(401).json({ success: false });
  }
};

module.exports = authenticate;
