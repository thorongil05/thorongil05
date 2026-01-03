const express = require("express");
const router = express.Router();
const realEstateDao = require("../features/real_estates_dao");

const logger = require("pino")();

router.post("/", (request, response) => {
  logger.info("Received request", request.body);
  response.appendHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  let realEstateInfo = request.body;

  realEstateDao
    .insert(realEstateInfo)
    .then((result) => {
      response.send(result);
    })
    .catch((error) => {
      response.status(500).send(error);
      logger.error(error);
    });
});

router.options("/", (request, response) => {
  logger.info("Received options");
  response.appendHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  response.appendHeader("Access-Control-Allow-Methods", "POST");
  response.appendHeader("Access-Control-Allow-Headers", "Content-Type");
  response.statusCode = 204;

  logger.info(response);
  response.send();
});

router.get("/", (request, response) => {
  const page = Number(request.query.page) || 0;
  const size = Number(request.query.size) || 10;
  logger.info(`Received get request. Page number: ${page}. Page size: ${size}`);
  response.appendHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  realEstateDao
    .retrieve(page, size)
    .then((result) => {
      logger.info(`Retrieved ${result.length} elements`);
      response.send(result);
    })
    .catch((error) => {
      response.status(500).send(error);
      logger.error(error);
    });
});

module.exports = router;
