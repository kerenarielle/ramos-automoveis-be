// server/index.js

const express = require("express");
const path = require("path");
const cors = require("cors");

const PORT = process.env.PORT || 3080;

const carsRouter = require("./cars");
const expensesRouter = require("./expenses");
const userRouter = require("./user");

const app = express(),
  bodyParser = require("body-parser");
port = 3080;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../backend/out")));

app.use(carsRouter);
app.use(expensesRouter);
app.use(userRouter);

app.listen(PORT);
