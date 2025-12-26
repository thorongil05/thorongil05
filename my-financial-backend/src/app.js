const express = require("express");
const routes = require("./routes");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use("/api", routes);

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

console.log("App loaded");

module.exports = app;
