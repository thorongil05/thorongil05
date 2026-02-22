const express = require("express");
const router = express.Router();
const mapper = require("../features/mapper");
const logger = require("pino")();

const competitionsDao = require("../features/competitions_dao");
const { authenticateToken } = require("../middleware/auth.middleware");
const { trackActivity } = require("../middleware/activity.middleware");

router.get("/", authenticateToken, (request, response) => {
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

router.get("/:id/editions", authenticateToken, (request, response) => {
  const competitionId = request.params.id;
  competitionsDao
    .retrieveEditions(competitionId)
    .then((result) => {
      response.send(result);
    })
    .catch((error) => {
      response.status(500).send(error);
    });
});

router.get(
  "/editions/:editionId/teams",
  authenticateToken,
  (request, response) => {
    const editionId = request.params.editionId;
    competitionsDao
      .retrieveTeams(editionId)
      .then((result) => {
        response.send({ data: result, metadata: { count: result.length } });
      })
      .catch((error) => {
        response.status(500).send(error);
      });
  },
);

router.get(
  "/editions/:editionId/standings",
  authenticateToken,
  (request, response) => {
    const editionId = request.params.editionId;
    let args = {};
    if (request.query) {
      args.startInterval = parseInt(request.query.startInterval);
      args.endInterval = parseInt(request.query.endInterval);
    }
    logger.info(
      `Competition resource, received get standings for edition ${editionId} with args ${JSON.stringify(args)}`,
    );
    competitionsDao
      .getStandings(editionId, args)
      .then((result) => {
        response.send(result);
      })
      .catch((error) => {
        response.status(500).send(error);
        logger.error(
          `Competition resource, error getting standings for edition ${editionId}`,
          error,
        );
      });
  },
);

router.post(
  "/",
  authenticateToken,
  trackActivity("competitions_added"),
  (request, response) => {
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
  },
);

router.post(
  "/:id/editions",
  authenticateToken,
  trackActivity("edition_added"),
  (request, response) => {
    const competitionId = request.params.id;
    const editionEntry = {
      competitionId,
      name: request.body.name,
      metadata: request.body.metadata || {},
    };
    competitionsDao
      .insertEdition(editionEntry)
      .then((result) => {
        response.send(result);
      })
      .catch((error) => {
        response.status(500).send(error);
      });
  },
);

router.put(
  "/:id",
  authenticateToken,
  trackActivity("competitions_updated"),
  (request, response) => {
    const competitionId = request.params.id;
    let competitionEntry = mapper.mapToCompetition(request.body);
    competitionsDao
      .update(competitionId, competitionEntry)
      .then((result) => {
        response.send(result);
      })
      .catch((error) => {
        response.status(500).send(error);
      });
  },
);

router.put(
  "/editions/:editionId",
  authenticateToken,
  trackActivity("edition_updated"),
  (request, response) => {
    const editionId = request.params.editionId;
    competitionsDao
      .updateEdition(editionId, request.body)
      .then((result) => {
        response.send(result);
      })
      .catch((error) => {
        response.status(500).send(error);
      });
  },
);

router.options("/", (request, response) => {
  response.set({
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
  });
  response.sendStatus(200);
});

module.exports = router;
