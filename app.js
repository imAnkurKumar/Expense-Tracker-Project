const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const app = express();

const userRouter = require("./router/userRouter");
const sequelize = require("./util/database");
const loginRouter = require("./router/loginRouter");
const expenseRouter = require("./router/expenseRouter");
const purchaseRouter = require("./router/purchaseMembershipRouter");

const User = require("./models/userModel");
const Expense = require("./models/expenseModel");
const Order = require("./models/ordersModel");

app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(bodyParser.json());

app.use("/", userRouter);
app.use("/user", userRouter);

app.use("/user/login", loginRouter);

app.use("/", expenseRouter);
app.use("/expense", expenseRouter);

app.use("/purchase", purchaseRouter);

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

sequelize
  .sync()
  .then((result) => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
