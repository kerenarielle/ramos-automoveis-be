const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Ke246801",
  database: "ramos",
  multipleStatements: true,
});

module.exports = connection;
