// App bootstrap
const app = require("./app");
const { swaggerUi, specs } = require("./swagger/swagger");

app.use("/swagger", swaggerUi.serve, swaggerUi.setup(specs));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

async function shutdown(signal) {
  console.log(`Received ${signal}. Closing resources...`);

  server.close(async () => {
    console.log("HTTP server closed");

    try {
      await pool.end();
      console.log("DB pool closed");
      process.exit(0);
    } catch (err) {
      console.error("Error closing DB pool", err);
      process.exit(1);
    }
  });
}

process.on("SIGINT", shutdown); // Ctrl + C
process.on("SIGTERM", shutdown); // Docker / Kubernetes
