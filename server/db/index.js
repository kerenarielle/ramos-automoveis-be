const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: process.env.APP_MYSQL_HOST,
  user: process.env.APP_MYSQL_USER,
  password: process.env.APP_MYSQL_PASS,
  database: process.env.APP_MYSQL_DATABASE,
  multipleStatements: true,
});

module.exports = connection;
