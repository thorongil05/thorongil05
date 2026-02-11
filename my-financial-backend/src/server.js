// App bootstrap
const app = require("./app");
const { swaggerUi, specs } = require("./swagger/swagger");
const logger = require("pino")();
const runMigrations = require("./features/migrate");

async function startServer() {
  try {
    await runMigrations();
    
    app.use("/swagger", swaggerUi.serve, swaggerUi.setup(specs));
    
    const PORT = process.env.PORT || 3000;
    
    const server = app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });

    // We need to return server so shutdown can access it
    return server;
  } catch (err) {
    logger.error({ err }, "Failed to start server due to migration error");
    process.exit(1);
  }
}

let server;
startServer().then(s => server = s);

async function shutdown(signal) {
  logger.info(`Received ${signal}. Closing resources...`);

  server.close(async () => {
    logger.info("HTTP server closed");

    try {
      await pool.end();
      logger.info("DB pool closed");
      process.exit(0);
    } catch (err) {
      logger.error("Error closing DB pool", err);
      process.exit(1);
    }
  });
}

process.on("SIGINT", shutdown); // Ctrl + C
process.on("SIGTERM", shutdown); // Docker / Kubernetes
