const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Financial API",
      version: "1.0.0",
      description:
        "API for managing financial instruments, real estate, and sports data",
    },
  },
  apis: ["./src/swagger/*.js"],
};

const specs = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  specs,
};
