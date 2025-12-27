const express = require("express");
const router = express.Router();
const realEstateDao = require("../features/real_estates_dao");

router.post("/", (request, response) => {
  console.log("Received request", request.body);
  let realEstateInfo = request.body;

  realEstateDao
    .insertRealEstateInfo(realEstateInfo)
    .then((result) => {
      response.send(result);
    })
    .catch((error) => {
      response.status(500);
      response.send(error);
      console.error(error);
    });
});

router.get("/", (request, response) => {
  console.log("Received request");
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
