const express = require("express");
const postgres = require("./postgres");

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
