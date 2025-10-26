const express = require("express");
const postgres = require("./postgres");
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
  postgres
    .fetchAllFinancialInstrumentsLight()
    .then((result) => {
      response.send(result);
    })
    .catch((error) => {
      response.status(500);
      response.send(error);
    });
});

app.post("/instruments", (request, response) => {
  if (request.body instanceof Object) {
    let financialInstrument = mapper.mapToFinancialInstrument(request.body);
    postgres
      .insertFinancialInstrument(financialInstrument)
      .then((result) => {
        response.send(result);
      })
      .catch((error) => {
        response.status(500);
        response.send(error);
        console.log(error);
      });
    return;
  }
  if (Array.isArray(request.body)) {
    let financialInstruments = request.body.map((element) => {
      return mapper.mapToFinancialInstrument(element);
    });
    postgres
      .insertManyFinancialInstruments(financialInstruments)
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
