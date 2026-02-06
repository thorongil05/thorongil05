const express = require("express");
const router = express.Router();
const mapper = require("../features/mapper");

const competitionsDao = require("../features/competitions_dao");

router.get("/", (request, response) => {
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

router.post("/", (request, response) => {
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

module.exports = router;
