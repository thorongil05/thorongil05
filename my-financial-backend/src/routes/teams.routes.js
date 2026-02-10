const express = require("express");
const router = express.Router();
const mapper = require("../features/mapper");

const teamsDao = require("../features/teams_dao");
const { authenticateToken } = require("../middleware/auth.middleware");

router.get("/", (request, response) => {
  response.appendHeader("Access-Control-Allow-Origin", "http://localhost:5173");
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

router.post("/", authenticateToken, (request, response) => {
  response.appendHeader("Access-Control-Allow-Origin", "http://localhost:5173");
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

router.options("/", (request, response) => {
  response.set({
    Allow: "GET, POST, OPTIONS",
    "Access-Control-Allow-Origin": "http://localhost:5173",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400", // 24 hours
  });
  response.status(200).send();
});

module.exports = router;
