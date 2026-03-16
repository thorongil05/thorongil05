const pgMigrate = require("node-pg-migrate");
const pool = require("./database");
const logger = require("pino")();

async function runMigrations() {
  try {
    // node-pg-migrate needs a connection string or client config
    // We already have the pool, we can use its options
    const dbConfig = {
      user: pool.options.user,
      password: pool.options.password,
      host: pool.options.host,
      port: pool.options.port,
      database: pool.options.database,
    };

    logger.info("Running pending migrations...");
    await pgMigrate.runner({
      databaseUrl: dbConfig,
      dir: "migrations",
      direction: "up",
      migrationsTable: "pgmigrations",
    });
    logger.info("Migrations completed successfully");
  } catch (err) {
    logger.error({ err }, "Migration failed");
    // We don't exit(1) here if we want the server to try to start anyway, 
    // but usually, if migrations fail, the app won't work.
    throw err;
  }
}

if (require.main === module) {
  runMigrations().catch(() => process.exit(1));
}

module.exports = runMigrations;
