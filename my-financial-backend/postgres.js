module.exports = {
  fetchAllFinancialInstrumentsLight: async function () {
    const { Pool } = require("pg");

    let poolConfig = {
      host: process.env.DB_HOST || "localhost",
      port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
      user: process.env.DB_USER || "postgres",
      password: process.env.DB_PASSWORD || "postgres",
      database: process.env.DB_NAME || "",
      max: 10,
    };

    const pool = new Pool(poolConfig);
    const res = await pool.query("SELECT * FROM financial_instruments");

    return res?.rows.map((value) => {
      return {
        isin: value.isin,
        name: value.name,
      };
    });
  },
  addFinancialInstrument: async function (financialInstrument) {},
};
