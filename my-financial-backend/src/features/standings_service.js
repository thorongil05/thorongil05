const logger = require("pino")();

function calculateStandings(matches, startInterval, endInterval) {
  logger.info(
    `Calculating standings for ${matches.length} matches with start interval ${startInterval} and end interval ${endInterval}`,
  );
  const standings = {};

  matches.forEach((match) => {
    if (match.round < startInterval || match.round > endInterval) {
      return;
    }
    // Process Home Team
    if (!standings[match.homeTeam.id]) {
      standings[match.homeTeam.id] = initializeTeam(match.homeTeam);
    }
    const homeStats = standings[match.homeTeam.id];

    // Process Away Team
    if (!standings[match.awayTeam.id]) {
      standings[match.awayTeam.id] = initializeTeam(match.awayTeam);
    }
    const awayStats = standings[match.awayTeam.id];

    // If match is not played (no score), skip stats update but ensure team is in standings
    if (match.homeScore === null || match.awayScore === null) {
      return;
    }

    // Update played
    homeStats.played += 1;
    awayStats.played += 1;

    // Update goals
    homeStats.goalsFor += match.homeScore;
    homeStats.goalsAgainst += match.awayScore;
    homeStats.goalDifference = homeStats.goalsFor - homeStats.goalsAgainst;

    awayStats.goalsFor += match.awayScore;
    awayStats.goalsAgainst += match.homeScore;
    awayStats.goalDifference = awayStats.goalsFor - awayStats.goalsAgainst;

    // Update points and w/d/l
    if (match.homeScore > match.awayScore) {
      homeStats.won += 1;
      homeStats.points += 3;
      awayStats.lost += 1;
    } else if (match.homeScore < match.awayScore) {
      awayStats.won += 1;
      awayStats.points += 3;
      homeStats.lost += 1;
    } else {
      homeStats.drawn += 1;
      homeStats.points += 1;
      awayStats.drawn += 1;
      awayStats.points += 1;
    }
  });

  // Convert to array and sort
  return Object.values(standings).sort((a, b) => {
    // 1. Points
    if (b.points !== a.points) {
      return b.points - a.points;
    }
    // 2. Goal Difference
    if (b.goalDifference !== a.goalDifference) {
      return b.goalDifference - a.goalDifference;
    }
    // 3. Goals For
    if (b.goalsFor !== a.goalsFor) {
      return b.goalsFor - a.goalsFor;
    }
    // 4. Alphabetical (for stable sort)
    return a.teamName.localeCompare(b.teamName);
  });
}

function initializeTeam(team) {
  return {
    teamId: team.id,
    teamName: team.name,
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDifference: 0,
    points: 0,
  };
}

module.exports = {
  calculateStandings,
};
