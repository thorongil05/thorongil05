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
  insertFinancialInstrument: async function (financialInstrument) {
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
    const result = await pool.query(
      `INSERT INTO financial_instruments
       (isin, symbol, name, type, currency, issue_date, maturity_date, issuer, nominal_value, market_price)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       RETURNING *`,
      [
        financialInstrument.isin,
        financialInstrument.symbol,
        financialInstrument.name,
        financialInstrument.type,
        financialInstrument.currency,
        financialInstrument.issue_date,
        financialInstrument.maturity_date,
        financialInstrument.issuer,
        financialInstrument.nominal_value,
        financialInstrument.market_price,
      ]
    );
    return result;
  },
  insertManyFinancialInstruments: async function (financialInstruments) {
    financialInstruments.forEach((element) => {
      this.insertFinancialInstrument(element);
    });
  },
};
