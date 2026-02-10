const express = require("express");
const routes = require("./routes");
const cors = require("cors");
const logger = require("pino")();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

app.use(express.json());
app.use("/api", routes);

logger.info("App loaded");

module.exports = app;
