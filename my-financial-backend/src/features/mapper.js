module.exports = {
  mapToFinancialInstrument: function (input) {
    return {
      isin: input.isin,
      name: input.name,
      issuer: input.issuer,
      nominalValue: input.nominalValue,
      type: input.type,
      currency: input.currency,
      issueDate: input.issue_date,
    };
  },
  mapToPrice: function (input) {
    return {
      priceDate: input.priceDate,
      openPrice: input.openPrice,
      closePrice: input.closePrice,
      highPrice: input.highPrice,
      lowPrice: input.lowPrice,
      volume: input.volume,
    };
  },
  mapToTeam: function (input) {
    return {
      name: input.name,
      city: input.city,
    };
  },
};
