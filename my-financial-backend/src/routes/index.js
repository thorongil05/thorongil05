const express = require("express");
const statusRoutes = require("./status.routes");

const router = express.Router();

router.use("/status", statusRoutes);

module.exports = router;
