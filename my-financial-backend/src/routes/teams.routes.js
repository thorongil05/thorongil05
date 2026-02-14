const express = require("express");
const router = express.Router();
const mapper = require("../features/mapper");

const teamsDao = require("../features/teams_dao");
const { authenticateToken, authorizeRole } = require("../middleware/auth.middleware");
const UserRoles = require("../constants/roles");

router.get("/", authenticateToken, (request, response) => {
  teamsDao
    .retrieveAll()
    .then((result) => {
      response.send({ data: result, metadata: { count: result.length } });
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

router.put("/:id", authenticateToken, authorizeRole([UserRoles.ADMIN, UserRoles.EDITOR]), (request, response) => {
  const id = request.params.id;
  const teamEntry = mapper.mapToTeam(request.body);
  teamsDao
    .update(id, teamEntry)
    .then((result) => {
      response.send(result);
    })
    .catch((error) => {
      response.status(500).send(error);
      console.log(error);
    });
});

router.delete("/:id", authenticateToken, authorizeRole([UserRoles.ADMIN, UserRoles.EDITOR]), (request, response) => {
  const id = request.params.id;
  teamsDao
    .deleteTeam(id)
    .then((result) => {
      response.send(result);
    })
    .catch((error) => {
      response.status(500).send(error);
      console.log(error);
    });
});

router.options("/", (request, response) => {
  response.set({
    Allow: "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400", // 24 hours
  });
  response.status(200).send();
});

module.exports = router;
