const express = require("express");
const router = express.Router();
const mapper = require("../features/mapper");
const logger = require("pino")();

const competitionsDao = require("../features/competitions_dao");
const { authenticateToken } = require("../middleware/auth.middleware");

router.get("/", (request, response) => {
  logger.info("Competition resourece, received get request", request);
  competitionsDao
    .retrieveAll()
    .then((result) => {
      response.send(result);
    })
    .catch((error) => {
      response.status(500);
      response.send(error);
      console.log(error);
    });
});

router.get("/:id/teams", (request, response) => {
  const competitionId = request.params.id;
  competitionsDao
    .retrieveTeams(competitionId)
    .then((result) => {
      response.send({ data: result, metadata: { count: result.length } });
    })
    .catch((error) => {
      response.status(500);
      response.send(error);
      console.log(error);
    });
});

router.get("/:id/standings", (request, response) => {
  const competitionId = request.params.id;
  competitionsDao
    .getStandings(competitionId)
    .then((result) => {
      response.send(result);
    })
    .catch((error) => {
      response.status(500);
      response.send(error);
      console.log(error);
    });
});

router.post("/", authenticateToken, (request, response) => {
  if (Array.isArray(request.body)) {
    throw new Exception("Not supported operation");
  }
  let competitionEntry = mapper.mapToCompetition(request.body);
  competitionsDao
    .insert(competitionEntry)
    .then((result) => {
      response.send(result);
    })
    .catch((error) => {
      response.status(500);
      response.send(error);
      console.log(error);
    });
});

router.options("/", (request, response) => {
  response.set({
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
  });
  response.sendStatus(200);
});

module.exports = router;
