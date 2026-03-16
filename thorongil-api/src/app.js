const express = require("express");
const routes = require("./routes");
const cors = require("cors");
const logger = require("pino")();

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGINS ?? "http://localhost:5173",
    credentials: true
  }),
);

app.use(express.json());
app.use("/api", routes);

logger.info("App loaded");

module.exports = app;
