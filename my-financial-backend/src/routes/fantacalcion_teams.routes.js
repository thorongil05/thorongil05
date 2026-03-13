const express = require("express");
const teamsDao = require("../features/fantacalcion_teams_dao");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const teams = await teamsDao.retrieveAll();
    res.json(teams);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const team = await teamsDao.insert(req.body);
    res.status(201).json(team);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const team = await teamsDao.update(req.params.id, req.body);
    res.json(team);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const result = await teamsDao.deleteTeam(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
