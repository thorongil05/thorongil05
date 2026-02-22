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
      editionId: input.editionId,
    };
  },
  mapToMatch: function (input) {
    return {
      matchDate: input.matchDate,
      editionId: input.editionId,
      homeTeamId: input.homeTeamId,
      awayTeamId: input.awayTeamId,
      homeGoals: input.homeGoals,
      awayGoals: input.awayGoals,
      stadium: input.stadium,
      round: input.round,
    };
  },
  mapToCompetition: function (input) {
    return {
      name: input.name,
      country: input.country,
      type: input.type,
      metadata: input.metadata || {},
    };
  },
};
