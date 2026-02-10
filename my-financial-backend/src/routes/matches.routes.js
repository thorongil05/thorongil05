const express = require("express");
const router = express.Router();
const mapper = require("../features/mapper");
const logger = require("pino")();

const matchesDao = require("../features/matches_dao");
const { authenticateToken } = require("../middleware/auth.middleware");

router.get("/", (request, response) => {
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

router.post("/", authenticateToken, (request, response) => {
  logger.info({ body: request.body }, "Received request");
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

router.put("/:id", authenticateToken, (request, response) => {
  logger.info({ body: request.body, id: request.params.id }, "Received update request");
  
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

router.delete("/:id", authenticateToken, (request, response) => {
  logger.info({ id: request.params.id }, "Received delete request");  
  matchesDao
    .deleteMatch(request.params.id)
    .then((result) => {
      if (result) {
        response.send(result);
      } else {
        response.status(404).send({ error: "Match not found" });
      }
    })
    .catch((error) => {
      response.status(500);
      response.send(error);
      console.log(error);
    });
});

router.options("/:id", (request, response) => {
  response.set({
    Allow: "PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Methods": "PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400", // 24 hours
  });
  response.status(200).send();
});

router.options("/", (request, response) => {
  response.set({
    Allow: "GET, POST, OPTIONS",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400", // 24 hours
  });
  response.status(200).send();
});

module.exports = router;
