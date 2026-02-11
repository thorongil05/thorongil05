const express = require("express");
const statusRoutes = require("./status.routes");
const instrumentRoutes = require("./instruments.routes");
const realEstatesRoutes = require("./realEstates.routes");
const teamsRoutes = require("./teams.routes");
const matchesRoutes = require("./matches.routes");
const competitionsRoutes = require("./competitions.routes");
const authRoutes = require("./auth.routes");

const router = express.Router();

router.use("/status", statusRoutes);
router.use("/instruments", instrumentRoutes);
router.use("/real-estates", realEstatesRoutes);
router.use("/teams", teamsRoutes);
router.use("/matches", matchesRoutes);
router.use("/competitions", competitionsRoutes);
router.use("/auth", authRoutes);

module.exports = router;
