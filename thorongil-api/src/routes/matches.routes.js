const express = require("express");
const router = express.Router();
const mapper = require("../features/mapper");
const logger = require("pino")();

const matchesDao = require("../features/matches_dao");
const { authenticateToken } = require("../middleware/auth.middleware");
const { trackActivity } = require("../middleware/activity.middleware");

router.get("/", authenticateToken, (request, response) => {
  const editionId = request.query.editionId;
  const phaseId = request.query.phaseId;
  const groupId = request.query.groupId;
  const round = request.query.round;
  const teamId = request.query.teamId;
  const sortBy = request.query.sortBy;
  const sortOrder = request.query.sortOrder;
  matchesDao
    .findMatches({
      round,
      teamId,
      sortBy,
      sortOrder,
      editionId,
      phaseId,
      groupId,
    })
    .then((result) => {
      response.send({
        data: result,
        metadata: {
          count: result.length,
        },
      });
    })
    .catch((error) => {
      response.status(500);
      response.send(error);
      logger.error({ error }, "Error fetching matches");
    });
});

router.get("/progress", authenticateToken, (request, response) => {
  const { editionId, groupId } = request.query;
  if (!editionId) {
    response.status(400).send({ error: "editionId is required" });
    return;
  }
  matchesDao
    .getProgress(editionId, groupId || null)
    .then((result) => response.send(result))
    .catch((error) => {
      logger.error({ error }, "Error fetching match progress");
      response.status(500).send(error);
    });
});

router.get("/rounds", authenticateToken, (request, response) => {
  const { editionId, phaseId, groupId } = request.query;
  if (!editionId) {
    response.status(400).send({ error: "editionId is required" });
    return;
  }
  matchesDao
    .findRounds(editionId, phaseId || null, groupId || null)
    .then((result) => response.send(result))
    .catch((error) => {
      response.status(500).send(error);
      logger.error({ error }, "Error fetching rounds");
    });
});

router.post(
  "/",
  authenticateToken,
  trackActivity("matches_added"),
  (request, response) => {
    logger.info({ body: request.body }, "Received request");

    if (Array.isArray(request.body)) {
      const matchEntries = request.body.map((item) => mapper.mapToMatch(item));
      matchesDao
        .bulkInsert(matchEntries)
        .then((result) => {
          logger.info({ count: result.length }, "Matches inserted in bulk");
          response.status(201).send(result);
        })
        .catch((error) => {
          response.status(500).send(error);
          logger.error({ error }, "Error inserting matches in bulk");
        });
    } else {
      let matchEntry = mapper.mapToMatch(request.body);
      matchesDao
        .insert(matchEntry)
        .then((result) => {
          logger.info({ match: result }, "Match inserted");
          response.status(201).send(result);
        })
        .catch((error) => {
          response.status(500).send(error);
          logger.error({ error }, "Error inserting match");
        });
    }
  },
);

router.put(
  "/:id",
  authenticateToken,
  trackActivity("matches_updated"),
  async (request, response) => {
    logger.info(
      { body: request.body, id: request.params.id },
      "Received update request",
    );

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
  },
);

router.delete(
  "/:id",
  authenticateToken,
  trackActivity("matches_deleted"),
  async (request, response) => {
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
  },
);

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
