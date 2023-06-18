const express = require("express");
const router = express.Router();
const connection = require("../db");
const transformPrice = require("../../utils/price/transformPrice");

router.get("/api/despesas/:id", (req, res) => {
  const { id } = req.params;
  connection.query(
    `SELECT * FROM despesas WHERE id_car = ${id}`,
    (err, results) => {
      res.send(results);
    }
  );
});

router.post("/api/update/despesas", (req, res) => {
  const { body } = req;

  const date = new Date(body.dt).toLocaleDateString("en-CA");

  if (body.id_despesas) {
    const { description, value, id_despesas } = body;
    return connection.query(
      `UPDATE despesas SET description = "${description}", value = "${transformPrice(
        value
      )}", dt = "${date}" WHERE id_despesas = "${id_despesas}"`,
      (err, results, fields) => {
        res.send({ status: 200 });
      }
    );
  }

  return connection.query(
    `INSERT INTO despesas(description, value, dt, id_car) VALUES("${
      body.description
    }", "${transformPrice(body.value)}", "${date}", ${body.id_car})`,
    (err, results, fields) => {
      if (results) return res.send({ status: 200 });

      return res.send({ status: 400 });
    }
  );
});

router.delete("/api/despesas/:id", (req, res) => {
  const { id } = req.params;

  return connection.query(
    `DELETE FROM despesas WHERE id_despesas = ${id}`,
    (err, results, fields) => {
      if (results) return res.send({ status: 200 });

      return res.send({ status: 400 });
    }
  );
});

module.exports = router;
