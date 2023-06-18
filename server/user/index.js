const express = require("express");
const router = express.Router();
const session = require("express-session");
const path = require("path");
const jwt = require("jsonwebtoken");
const connection = require("../db");

router.use(
  session({
    secret: "webslesson",
    resave: true,
    saveUninitialized: true,
  })
);

router.post("/api/auth", function (request, response) {
  // Capture the input fields
  let email = request.body.email;
  let password = request.body.password;
  // Ensure the input fields exist and are not empty
  if (email && password) {
    // Execute SQL query that'll select the account from the database based on the specified username and password
    connection.query(
      "SELECT * FROM user WHERE email = ? AND password = ?",
      [email, password],
      function (error, results, fields) {
        if (error) throw error;

        // If the account exists
        if (results.length > 0) {
          // Generate a token
          const token = jwt.sign({ email }, "your-secret-key", {
            expiresIn: "1h",
          });

          // Set the token in the response headers or body
          response.setHeader("Authorization", `Bearer ${token}`);
          // or response.json({ token });

          // Redirect to home page or return a success message
          // response.redirect("/home");
          response.status(200).json({ token, user: results[0].name });
        } else {
          response.status(400).json("Usuário ou senha incorreto!");
        }
        response.end();
      }
    );
  } else {
    response.send("Please enter Username and Password!");
    response.end();
  }
});

module.exports = router;
