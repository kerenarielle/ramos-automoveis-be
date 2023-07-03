const express = require("express");
const router = express.Router();
const { createCar, updateCar } = require("../../utils/CreateCar");
const connection = require("../db");

const monthCompleted = (month) => {
  if (month.length === 2) return `-${month}`;

  return `-0${month}`;
};

router.get("/api/cars", async (req, res) => {
  try {
    const allCars = "SELECT * FROM cars";
    const allDespesas = "SELECT * FROM despesas";

    const [cars, carFields] = await connection.execute(allCars);
    const [despesas, despesasFields] = await connection.execute(allDespesas);

    const responseCar = cars.map((dataCar) => ({
      ...dataCar,
      consignado: dataCar.consignado === 1 ? true : false,
      despesas: despesas
        .filter((despesaCar) => despesaCar.id_car === dataCar.id_car)
        .map((v) => parseFloat(v.value)),
    }));

    res.send(responseCar);
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro no servidor");
  }
});

router.get("/api/car/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [results, fields] = await connection.execute(
      `SELECT * FROM cars WHERE id_car = ?`,
      [id]
    );

    return res.send(results[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro no servidor");
  }
});

router.post("/api/update/car", async (req, res) => {
  const { body } = req;
  const { id_car } = body;

  const condition = updateCar(body);

  try {
    const [results, fields] = await connection.execute(
      `UPDATE cars SET ${condition} WHERE id_car = ?`,
      [id_car]
    );
    if (results) return res.send({ status: 200 });
    return res.send({ status: 400 });
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro no servidor");
  }
});

router.delete("/api/cars/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [results, fields] = await connection.execute(
      `DELETE FROM cars WHERE id_car = ?`,
      [id]
    );
    if (results) return res.send({ status: 200 });
    return res.send({ status: 400 });
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro no servidor");
  }
});

router.post("/api/cars/create", async (req, res) => {
  const { body } = req;
  const { fields, values } = createCar(body);

  try {
    const [results, field] = await connection.execute(
      `INSERT INTO cars(${fields}) VALUES(${values})`
    );

    res.send({ id: results.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro no servidor");
  }
});

router.get("/api/cars/full", async (req, res) => {
  const month = new Date().getUTCMonth() + 1;
  const year = new Date().getFullYear();

  const dt_compra = `dt_compra >= "${year}${monthCompleted(
    month.toString()
  )}-01" and dt_compra  <= "${year}${monthCompleted(month.toString())}-31"`;
  const dt_venda = `dt_venda >= "${year}${monthCompleted(
    month.toString()
  )}-01" and dt_venda  <= "${year}${monthCompleted(month.toString())}-31"`;

  try {
    const [results, fields] = await connection.execute(
      `SELECT * FROM cars WHERE (${dt_compra}) OR (${dt_venda})`
    );

    const vendido =
      (results && results.filter(({ dt_venda }) => dt_venda)) || [];
    const compra =
      (results && results.filter(({ dt_venda }) => !dt_venda)) || [];

    return res.send({ vendido, compra });
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro no servidor");
  }
});

module.exports = router;
