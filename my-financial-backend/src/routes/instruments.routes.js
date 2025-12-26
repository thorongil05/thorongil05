const express = require("express");
const router = express.Router();
const instrumentsDao = require("../features/instruments_dao");
const pricesDao = require("../features/prices_dao");
const mapper = require("../features/mapper");

router.get("/", (request, response) => {
  response.appendHeader("Access-Control-Allow-Origin", "*");
  instrumentsDao
    .fetchAllFinancialInstrumentsLight()
    .then((result) => {
      response.send(result);
    })
    .catch((error) => {
      response.status(500);
      console.log(error);
      response.send(error);
    });
});

router.post("/", (request, response) => {
  if (Array.isArray(request.body)) {
    let financialInstruments = request.body.map((element) => {
      return mapper.mapToFinancialInstrument(element);
    });
    instrumentsDao
      .insertManyFinancialInstruments(financialInstruments)
      .then((result) => {
        response.send(result);
      })
      .catch((error) => {
        response.status(500);
        response.send(error);
        console.log(error);
      });
  } else {
    let financialInstrument = mapper.mapToFinancialInstrument(request.body);
    instrumentsDao
      .insertFinancialInstrument(financialInstrument)
      .then((result) => {
        response.send(result);
      })
      .catch((error) => {
        response.status(500);
        response.send(error);
        console.log(error);
      });
  }
});

router.post("/{id}/prices", (request, response) => {
  let id = request.params["id"];
  if (Array.isArray(request.body)) {
    let prices = request.body.map(mapper.mapToPrice);
    pricesDao
      .insertManyPrices(id, prices)
      .then((result) => {
        response.send(result);
      })
      .catch((error) => {
        response.status(500);
        response.send(error);
        console.log(error);
      });
  } else {
    throw new TypeError("Error");
  }
});

module.exports = router;
