const express = require("express");
const router = express.Router();
const realEstateDao = require("../features/real_estates_dao");

router.post("/", (request, response) => {
  console.log("Received request", request.body);
  response.appendHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  let realEstateInfo = request.body;

  realEstateDao
    .insertRealEstateInfo(realEstateInfo)
    .then((result) => {
      response.send(result);
    })
    .catch((error) => {
      response.status(500);
      console.log(response);
      response.send(error);
      console.error(error);
    });
});

router.options("/", (request, response) => {
  console.log("Received options");
  response.appendHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  response.appendHeader("Access-Control-Allow-Methods", "POST");
  response.appendHeader("Access-Control-Allow-Headers", "Content-Type");
  response.statusCode = 204;

  console.log(response);
  response.send();
});

router.get("/", (request, response) => {
  console.log("Received get request");
  response.appendHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  realEstateDao
    .retrieve()
    .then((result) => {
      response.send(result);
    })
    .catch((error) => {
      response.status(500);
      response.send(error);
      console.error(error);
    });
});

module.exports = router;
