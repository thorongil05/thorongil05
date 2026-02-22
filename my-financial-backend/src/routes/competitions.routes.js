const express = require("express");
const router = express.Router();
const mapper = require("../features/mapper");
const logger = require("pino")();

const competitionsDao = require("../features/competitions_dao");
const phasesDao = require("../features/phases_dao");
const groupsDao = require("../features/groups_dao");
const {
  authenticateToken,
  authorizeRole,
} = require("../middleware/auth.middleware");
const { trackActivity } = require("../middleware/activity.middleware");
const UserRoles = require("../constants/roles");

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

router.get("/editions/:editionId", authenticateToken, (request, response) => {
  const editionId = request.params.editionId;
  competitionsDao
    .retrieveEdition(editionId)
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
      args.phaseId = request.query.phaseId
        ? parseInt(request.query.phaseId)
        : null;
      args.groupId = request.query.groupId
        ? parseInt(request.query.groupId)
        : null;
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

// --- PHASES ROUTES ---

router.get(
  "/editions/:editionId/phases",
  authenticateToken,
  (request, response) => {
    const editionId = request.params.editionId;
    phasesDao
      .retrieveByEdition(editionId)
      .then((result) => response.send(result))
      .catch((error) => response.status(500).send(error));
  },
);

router.post(
  "/editions/:editionId/phases",
  authenticateToken,
  authorizeRole([UserRoles.ADMIN, UserRoles.EDITOR]),
  trackActivity("phase_added"),
  (request, response) => {
    const editionId = request.params.editionId;
    phasesDao
      .insert({ ...request.body, editionId })
      .then((result) => response.send(result))
      .catch((error) => response.status(500).send(error));
  },
);

router.put(
  "/phases/:phaseId",
  authenticateToken,
  authorizeRole([UserRoles.ADMIN, UserRoles.EDITOR]),
  trackActivity("phase_updated"),
  (request, response) => {
    const phaseId = request.params.phaseId;
    const phaseEntry = mapper.mapToPhase(request.body);
    phasesDao
      .update(phaseId, phaseEntry)
      .then((result) => response.send(result))
      .catch((error) => response.status(500).send(error));
  },
);

router.delete(
  "/phases/:phaseId",
  authenticateToken,
  authorizeRole([UserRoles.ADMIN, UserRoles.EDITOR]),
  trackActivity("phase_deleted"),
  (request, response) => {
    const phaseId = request.params.phaseId;
    phasesDao
      .deletePhase(phaseId)
      .then((result) => response.send(result))
      .catch((error) => response.status(500).send(error));
  },
);

// --- GROUPS ROUTES ---

router.get(
  "/phases/:phaseId/groups",
  authenticateToken,
  (request, response) => {
    const phaseId = request.params.phaseId;
    groupsDao
      .retrieveByPhase(phaseId)
      .then((result) => response.send(result))
      .catch((error) => response.status(500).send(error));
  },
);

router.post(
  "/phases/:phaseId/groups",
  authenticateToken,
  authorizeRole([UserRoles.ADMIN, UserRoles.EDITOR]),
  trackActivity("group_added"),
  (request, response) => {
    const phaseId = request.params.phaseId;
    groupsDao
      .insert({ ...request.body, phaseId })
      .then((result) => response.send(result))
      .catch((error) => response.status(500).send(error));
  },
);

router.put(
  "/groups/:groupId",
  authenticateToken,
  authorizeRole([UserRoles.ADMIN, UserRoles.EDITOR]),
  trackActivity("group_updated"),
  (request, response) => {
    const groupId = request.params.groupId;
    const groupEntry = mapper.mapToGroup(request.body);
    groupsDao
      .update(groupId, groupEntry)
      .then((result) => response.send(result))
      .catch((error) => response.status(500).send(error));
  },
);

router.delete(
  "/groups/:groupId",
  authenticateToken,
  authorizeRole([UserRoles.ADMIN, UserRoles.EDITOR]),
  trackActivity("group_deleted"),
  (request, response) => {
    const groupId = request.params.groupId;
    groupsDao
      .deleteGroup(groupId)
      .then((result) => response.send(result))
      .catch((error) => response.status(500).send(error));
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
