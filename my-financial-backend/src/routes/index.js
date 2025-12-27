const express = require("express");
const statusRoutes = require("./status.routes");
const instrumentRoutes = require("./instruments.routes");
const realEstatesRoutes = require("./realEstates.routes");

const router = express.Router();

router.use("/status", statusRoutes);
router.use("/instruments", instrumentRoutes);
router.use("/real-estates", realEstatesRoutes);

module.exports = router;
