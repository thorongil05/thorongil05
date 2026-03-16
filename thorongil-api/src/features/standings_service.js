const logger = require("pino")();

function updateTeamStats(stats, goalsFor, goalsAgainst) {
  stats.played += 1;
  stats.goalsFor += goalsFor;
  stats.goalsAgainst += goalsAgainst;
  stats.goalDifference = stats.goalsFor - stats.goalsAgainst;
  if (goalsFor > goalsAgainst) {
    stats.won += 1;
    stats.points += 3;
  } else if (goalsFor < goalsAgainst) {
    stats.points += 0; // Explicit for clarity
    stats.lost += 1;
  } else {
    stats.drawn += 1;
    stats.points += 1;
  }
}

function calculateStandings(matches, startInterval, endInterval) {
  logger.info(`Standings for ${matches.length} matches [${startInterval}, ${endInterval}]`);
  const standings = {};

  matches.forEach((match) => {
    if (match.round < startInterval || match.round > endInterval) return;
    if (!standings[match.homeTeam.id]) standings[match.homeTeam.id] = initializeTeam(match.homeTeam);
    if (!standings[match.awayTeam.id]) standings[match.awayTeam.id] = initializeTeam(match.awayTeam);
    
    if (match.homeScore === null || match.awayScore === null) return;

    updateTeamStats(standings[match.homeTeam.id], match.homeScore, match.awayScore);
    updateTeamStats(standings[match.awayTeam.id], match.awayScore, match.homeScore);
  });

  return Object.values(standings).sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
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
