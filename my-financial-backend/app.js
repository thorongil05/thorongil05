const express = require("express");
const instrumentsDao = require("./instruments_dao");
const pricesDao = require("./prices_dao");
const mapper = require("./mapper");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server Listening on PORT:", PORT);
});

app.get("/status", (request, response) => {
  const status = {
    Status: "Running",
  };

  response.send(status);
});

app.get("/instruments", (request, response) => {
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

app.post("/instruments", (request, response) => {
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

app.post("/instruments/:id/prices", (request, response) => {
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
