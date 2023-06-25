const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const connection = require("../db");

router.post("/api/auth", async (request, response) => {
  console.log("bateu aqui");
  try {
    // Capture the input fields
    const { email, password } = request.body;
    // Ensure the input fields exist and are not empty
    if (email && password) {
      // Execute SQL query that'll select the account from the database based on the specified username and password
      const [results, fields] = await connection.execute(
        "SELECT * FROM user WHERE email = ? AND password = ?",
        [email, password]
      );

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
    } else {
      response.status(400).send("Please enter Username and Password!");
      response.end();
    }
  } catch (error) {
    console.error(error);
    response.status(500).send("Erro no servidor");
    response.end();
  }
});

module.exports = router;
