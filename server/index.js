// server/index.js

const express = require("express");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");

dotenv.config();

const PORT = process.env.PORT || 3080;

const carsRouter = require("./cars");
const expensesRouter = require("./expenses");
const userRouter = require("./user");

const app = express();

const bodyParser = require("body-parser");

app.use(
  cors({
    origin: "https://ramos-automoveis-fe-47a51f7ed71c.herokuapp.com",
    methods: ["GET", "POST", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../backend/out")));

app.use(carsRouter);
app.use(expensesRouter);
app.use(userRouter);

http.createServer(app).listen(PORT);
