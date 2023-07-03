const transformPrice = require("../price/transformPrice");

const formatBRL = (dt) => {
  const dateFormat = dt.replaceAll("-", "/");
  const date = new Date(dateFormat);

  return date
    .toLocaleDateString("pt-BR", {
      timeZone: "America/Sao_Paulo",
    })
    .split("/")
    .reverse()
    .join("/");
};

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
  const conditionRequired = `"${marca}","${modelo}","${cor}","${ano}","${placa}","${formatBRL(
    dt_compra
  )}","${transformPrice(valor_compra)}",${consignado ? 1 : 0}`;
  const compradorOption = `${comprador && `,"${comprador}"`}`;
  const valorVendaOption = `${
    valor_venda && `,"${transformPrice(valor_venda)}"`
  }`;
  const dtVendaOption = `${dt_venda && `,"${formatBRL(dt_venda)}"`}`;

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
    dt_compra = "${formatBRL(dt_compra)}",
    valor_compra = "${transformPrice(valor_compra)}",
    consignado = "${consignado ? 1 : 0}",
    comprador = "${comprador}"
    ${dt_venda && `, dt_venda = "${formatBRL(dt_venda)}"`}
    ${valor_venda && `, valor_venda = "${transformPrice(valor_venda)}"`}`;
};

module.exports = { createCar, updateCar };
