const express = require("express");
const router = express.Router();
const mapper = require("../features/mapper");

const teamsDao = require("../features/teams_dao");

router.get("/", (request, response) => {
  teamsDao
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
  let teamEntry = mapper.mapToTeam(request.body);
  teamsDao
    .insert(teamEntry)
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
