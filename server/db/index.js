const mysql = require("mysql2");

const dotenv = require("dotenv");
dotenv.config();

const pool = mysql.createPool({
  connectionLimit: 20, // Defina o número máximo de conexões permitidas no pool
  host: process.env.APP_MYSQL_HOST,
  user: process.env.APP_MYSQL_USER,
  password: process.env.APP_MYSQL_PASS,
  database: process.env.APP_MYSQL_DATABASE,
  multipleStatements: true,
});

const connection = pool.promise();

module.exports = connection;
