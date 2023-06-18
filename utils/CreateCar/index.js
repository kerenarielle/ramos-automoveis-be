const moment = require("moment");
const transformPrice = require("../price/transformPrice");

const createCar = (body) => {
  const {
    marca,
    modelo,
    cor,
    ano,
    placa,
    dt_compra,
    dt_venda,
    valor_compra,
    valor_venda,
    comprador,
    consignado,
  } = body;
  const conditionRequired = `"${marca}","${modelo}","${cor}","${ano}","${placa}","${new Date(
    dt_compra
  ).toLocaleDateString("en-ZA")}","${transformPrice(valor_compra)}",${
    consignado ? 1 : 0
  }`;
  const compradorOption = `${comprador && `,"${comprador}"`}`;
  const valorVendaOption = `${
    valor_venda && `,"${transformPrice(valor_venda)}"`
  }`;
  const dtVendaOption = `${dt_venda && `,"${dt_venda}"`}`;

  const queryFields = `marca, modelo, cor, ano, placa, dt_compra, valor_compra, consignado`;

  const fieldComprador = `${comprador && ", comprador"}`;
  const fieldValorVenda = `${valor_venda && ", valor_venda"}`;
  const fieldDtVenda = `${dt_venda && ", dt_venda"}`;

  const values = `${conditionRequired}${compradorOption}${valorVendaOption}${dtVendaOption}`;
  const fields = `${queryFields}${fieldComprador}${fieldValorVenda}${fieldDtVenda}`;

  return { fields, values };
};

const updateCar = (body) => {
  const {
    marca,
    modelo,
    cor,
    ano,
    placa,
    dt_compra,
    valor_compra,
    consignado,
    comprador,
    dt_venda,
    valor_venda,
  } = body;

  return `
    marca = "${marca}",
    modelo = "${modelo}",
    cor = "${cor}",
    ano = "${ano}",
    placa = "${placa}",
    dt_compra = "${new Date(dt_compra).toLocaleDateString("en-ZA")}",
    valor_compra = "${transformPrice(valor_compra)}",
    consignado = "${consignado ? 1 : 0}",
    comprador = "${comprador}"
    ${
      dt_venda &&
      `, dt_venda = "${new Date(dt_venda).toLocaleDateString("en-ZA")}"`
    }
    ${valor_venda && `, valor_venda = "${transformPrice(valor_venda)}"`}`;
};

module.exports = { createCar, updateCar };
