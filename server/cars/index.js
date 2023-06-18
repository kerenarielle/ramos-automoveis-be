const express = require("express");
const router = express.Router();
const { createCar, updateCar } = require("../../utils/CreateCar");
const connection = require("../db");

const monthCompleted = (month) => {
  if (month.length === 2) return `-${month}`;

  return `-0${month}`;
};

router.get("/api/cars", (req, res) => {
  const allCars = "SELECT * FROM ramos.cars";
  const allDesoesas = "SELECT * FROM ramos.despesas";

  connection.query(allCars, (err, cars) => {
    connection.query(allDesoesas, function (err, despesas) {
      const responseCar = cars.map((dataCar) => ({
        ...dataCar,
        consignado: dataCar.consignado === 1 ? true : false,
        despesas: despesas
          .filter((despesaCar) => despesaCar.id_car === dataCar.id_car)
          .map((v) => parseFloat(v.value)),
      }));

      res.send(responseCar);
    });
  });
});

router.get("/api/car/:id", (req, res) => {
  const { id } = req.params;
  connection.query(
    `SELECT * FROM ramos.cars WHERE id_car = ${id}`,
    (err, results) => {
      return res.send(results[0]);
    }
  );
});

router.post("/api/update/car", (req, res) => {
  const { body } = req;
  const { id_car } = body;

  const condition = updateCar(body);

  return connection.query(
    `UPDATE ramos.cars SET ${condition} WHERE id_car = ${id_car}`,
    (err, results, fields) => {
      if (results) return res.send({ status: 200 });

      return res.send({ status: 400 });
    }
  );
});

router.delete("/api/cars/:id", (req, res) => {
  const { id } = req.params;

  return connection.query(
    `DELETE FROM ramos.cars WHERE id_car = ${id}`,
    (err, results, fields) => {
      if (results) return res.send({ status: 200 });

      return res.send({ status: 400 });
    }
  );
});

router.post("/api/cars/create", (req, res) => {
  const { body } = req;
  const { fields, values } = createCar(body);

  connection.query(
    `INSERT INTO ramos.cars(${fields}) VALUES(${values})`,
    (err, results, fields) => {
      res.send({ id: results.insertId });
    }
  );
});

router.get("/api/cars/full", (req, res) => {
  const month = new Date().getUTCMonth() + 1;
  const year = new Date().getFullYear();

  const dt_compra = `dt_compra >= "${year}${monthCompleted(
    month.toString()
  )}-01" and dt_compra  <= "${year}${monthCompleted(month.toString())}-31"`;
  const dt_venda = `dt_venda >= "${year}${monthCompleted(
    month.toString()
  )}-01" and dt_venda  <= "${year}${monthCompleted(month.toString())}-31"`;

  connection.query(
    `SELECT * FROM ramos.cars WHERE (${dt_compra}) OR (${dt_venda})`,
    (err, results) => {
      const vendido =
        (results && results.filter(({ dt_venda }) => dt_venda)) || [];
      const compra =
        (results && results.filter(({ dt_venda }) => !dt_venda)) || [];

      return res.send({ vendido, compra });
    }
  );
});

module.exports = router;
