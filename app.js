const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const userRouter = require("./router/userRouter");
const sequelize = require("./util/database");
const loginRouter = require("./router/loginRouter");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/", userRouter);
app.use("/user", userRouter);
app.use("/user/login", loginRouter);


sequelize
  .sync()
  .then((result) => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
