module.exports = {
  insertPriceForInstrument: async function (instrumentId, prices) {
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
      `INSERT INTO instrument_price_history
       (instrument_id, price_date, open_price, close_price, high_price, low_price, volume)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       RETURNING *`,
      [
        instrumentId,
        prices.priceDate,
        prices.openPrice,
        prices.closePrice,
        prices.highPrice,
        prices.lowPrice,
        prices.volume,
      ]
    );
    return result;
  },
  insertManyPrices: async function (instrumentId, prices) {
    for (const element of prices) {
      await this.insertPriceForInstrument(instrumentId, element);
    }
  },
};
