// App bootstrap
const app = require("./app");
const { swaggerUi, specs } = require("./swagger/swagger");

app.use("/swagger", swaggerUi.serve, swaggerUi.setup(specs));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
