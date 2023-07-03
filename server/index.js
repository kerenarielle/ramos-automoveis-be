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

// Verifica se está no ambiente de produção
const isProduction = process.env.NODE_ENV === "production";

// Middleware de CORS
app.use(
  cors({
    "Access-Control-Allow-Origin": "*",
    origin: process.env.APP_CORS,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../backend/out")));

app.use(carsRouter);
app.use(expensesRouter);
app.use(userRouter);

http.createServer(app).listen(PORT);
