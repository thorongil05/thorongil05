const express = require("express");
const router = express.Router();
const mapper = require("../features/mapper");

const matchesDao = require("../features/matches_dao");

router.get("/", (request, response) => {
  matchesDao
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

module.exports = router;