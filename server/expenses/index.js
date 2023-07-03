const express = require("express");
const router = express.Router();
const connection = require("../db");
const transformPrice = require("../../utils/price/transformPrice");

router.get("/api/despesas/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [results, fields] = await connection.execute(
      `SELECT * FROM despesas WHERE id_car = ?`,
      [id]
    );
    res.send(results);
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro no servidor");
  }
});

router.post("/api/update/despesas", async (req, res) => {
  const { body } = req;

  const formatBRL = (dt) => {
    const [year, month, day] = dt.split("-");
    const date = new Date(
      Date.UTC(Number(year), Number(month) - 1, Number(day), 0, 0, 0)
    );
    date.setUTCHours(date.getUTCHours() + 12); // Adiciona 3 horas para compensar o fuso horário da Heroku

    return date
      .toLocaleDateString("pt-BR", {
        timeZone: "America/Sao_Paulo",
      })
      .split("/")
      .reverse()
      .join("/");
  };
  const date = formatBRL(body.dt);

  if (body.id_despesas) {
    const { description, value, id_despesas } = body;
    try {
      await connection.execute(
        `UPDATE despesas SET description = ?, value = ?, dt = ? WHERE id_despesas = ?`,
        [description, transformPrice(value), date, id_despesas]
      );
      res.send({ status: 200 });
    } catch (error) {
      console.error(error);
      res.status(500).send("Erro no servidor");
    }
  } else {
    try {
      const [results, fields] = await connection.execute(
        `INSERT INTO despesas(description, value, dt, id_car) VALUES(?, ?, ?, ?)`,
        [body.description, transformPrice(body.value), date, body.id_car]
      );
      if (results) return res.send({ status: 200 });
      return res.send({ status: 400 });
    } catch (error) {
      console.error(error);
      res.status(500).send("Erro no servidor");
    }
  }
});

router.delete("/api/despesas/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [results, fields] = await connection.execute(
      `DELETE FROM despesas WHERE id_despesas = ?`,
      [id]
    );
    if (results) return res.send({ status: 200 });
    return res.send({ status: 400 });
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro no servidor");
  }
});

module.exports = router;
