const express = require("express");
const router = express.Router();
const mapper = require("../features/mapper");
const logger = require("pino")();

const matchesDao = require("../features/matches_dao");

router.get("/", (request, response) => {
  response.appendHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  const competitionId = request.query.competitionId;
  const round = request.query.round;
  matchesDao
    .findMatches(competitionId, round)
    .then((result) => {
      response.send(result);
    })
    .catch((error) => {
      response.status(500);
      response.send(error);
      console.log(error);
    });
});

router.get("/rounds", (request, response) => {
  response.appendHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  const competitionId = request.query.competitionId;
  if (!competitionId) {
    response.status(400).send({ error: "competitionId is required" });
    return;
  }
  matchesDao
    .findRounds(competitionId)
    .then((result) => {
      response.send(result);
    })
    .catch((error) => {
      response.status(500);
      response.send(error);
      console.log(error);
    });
});

router.post("/", (request, response) => {
  logger.info({ body: request.body }, "Received request");
  response.appendHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  if (Array.isArray(request.body)) {
    throw new Exception("Not supported operation");
  }
  let matchEntry = mapper.mapToMatch(request.body);
  matchesDao
    .insert(matchEntry)
    .then((result) => {
      response.send(result);
    })
    .catch((error) => {
      response.status(500);
      response.send(error);
      console.log(error);
    });
});

router.put("/:id", (request, response) => {
  logger.info({ body: request.body, id: request.params.id }, "Received update request");
  response.appendHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  
  let matchEntry = mapper.mapToMatch(request.body);
  matchesDao
    .update(request.params.id, matchEntry)
    .then((result) => {
      response.send(result);
    })
    .catch((error) => {
      response.status(500);
      response.send(error);
      console.log(error);
    });
});

router.options("/:id", (request, response) => {
  response.set({
    Allow: "PUT, OPTIONS",
    "Access-Control-Allow-Origin": "http://localhost:5173",
    "Access-Control-Allow-Methods": "PUT, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400", // 24 hours
  });
  response.status(200).send();
});

router.options("/", (request, response) => {
  response.set({
    Allow: "GET, POST, OPTIONS",
    "Access-Control-Allow-Origin": "http://localhost:5173",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400", // 24 hours
  });
  response.status(200).send();
});

module.exports = router;
