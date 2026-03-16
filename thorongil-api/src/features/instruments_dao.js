const pool = require("./database");

module.exports = {
  fetchAllFinancialInstrumentsLight: async function () {
    const res = await pool.query("SELECT * FROM financial_instruments");

    return res?.rows.map((value) => {
      return {
        id: value.id,
        isin: value.isin,
        name: value.name,
      };
    });
  },
  insertFinancialInstrument: async function (financialInstrument) {
    const result = await pool.query(
      `INSERT INTO financial_instruments
       (isin, symbol, name, type, currency, issue_date, maturity_date, issuer, nominal_value)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       RETURNING *`,
      [
        financialInstrument.isin,
        financialInstrument.symbol,
        financialInstrument.name,
        financialInstrument.type,
        financialInstrument.currency,
        financialInstrument.issueDate,
        financialInstrument.maturityDate,
        financialInstrument.issuer,
        financialInstrument.nominalValue,
      ]
    );
    return result;
  },
  insertManyFinancialInstruments: async function (financialInstruments) {
    for (const element of financialInstruments) {
      await this.insertFinancialInstrument(element);
    }
  },
};
