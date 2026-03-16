const express = require("express");
const playersDao = require("../features/fantacalcion_players_dao");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const players = await playersDao.retrieveAll();
    res.json(players);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const player = await playersDao.insert(req.body);
    res.status(201).json(player);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const player = await playersDao.update(req.params.id, req.body);
    res.json(player);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const result = await playersDao.deletePlayer(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
