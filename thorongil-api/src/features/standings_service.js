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

function getH2HStats(teams, matches) {
  const ids = new Set(teams.map((t) => t.teamId));
  const stats = Object.fromEntries(
    teams.map((t) => [t.teamId, { points: 0, goalDifference: 0 }]),
  );
  matches
    .filter(
      (m) =>
        ids.has(m.homeTeam.id) &&
        ids.has(m.awayTeam.id) &&
        m.homeScore != null &&
        m.awayScore != null,
    )
    .forEach((m) => {
      if (m.homeScore > m.awayScore) {
        stats[m.homeTeam.id].points += 3;
      } else if (m.homeScore < m.awayScore) {
        stats[m.awayTeam.id].points += 3;
      } else {
        stats[m.homeTeam.id].points += 1;
        stats[m.awayTeam.id].points += 1;
      }
      stats[m.homeTeam.id].goalDifference += m.homeScore - m.awayScore;
      stats[m.awayTeam.id].goalDifference += m.awayScore - m.homeScore;
    });
  return stats;
}

function getValueFn(criterion, h2hStats) {
  switch (criterion) {
    case "HEAD_TO_HEAD_POINTS":
      return (t) => h2hStats?.[t.teamId]?.points ?? 0;
    case "HEAD_TO_HEAD_GOAL_DIFFERENCE":
      return (t) => h2hStats?.[t.teamId]?.goalDifference ?? 0;
    case "GOAL_DIFFERENCE":
      return (t) => t.goalDifference;
    case "GOALS_FOR":
      return (t) => t.goalsFor;
    case "GOALS_AGAINST":
      return (t) => -t.goalsAgainst;
    case "WINS":
      return (t) => t.won;
    default:
      return () => 0;
  }
}

function resolveGroup(teams, criteria, allMatches) {
  if (teams.length <= 1) return teams;
  if (criteria.length === 0) {
    return [...teams].sort((a, b) => a.teamName.localeCompare(b.teamName));
  }
  const [criterion, ...rest] = criteria;
  const isH2H =
    criterion === "HEAD_TO_HEAD_POINTS" ||
    criterion === "HEAD_TO_HEAD_GOAL_DIFFERENCE";
  const h2hStats = isH2H ? getH2HStats(teams, allMatches) : null;
  const valueFn = getValueFn(criterion, h2hStats);
  const sorted = [...teams].sort((a, b) => valueFn(b) - valueFn(a));
  const result = [];
  let i = 0;
  while (i < sorted.length) {
    let j = i + 1;
    while (j < sorted.length && valueFn(sorted[j]) === valueFn(sorted[i])) j++;
    const group = sorted.slice(i, j);
    result.push(...(group.length > 1 ? resolveGroup(group, rest, allMatches) : group));
    i = j;
  }
  return result;
}

function sortByPoints(teams, criteria, matches) {
  const byPoints = [...teams].sort((a, b) => b.points - a.points);
  const result = [];
  let i = 0;
  while (i < byPoints.length) {
    let j = i + 1;
    while (j < byPoints.length && byPoints[j].points === byPoints[i].points) j++;
    const group = byPoints.slice(i, j);
    result.push(...(group.length > 1 ? resolveGroup(group, criteria, matches) : group));
    i = j;
  }
  return result;
}

function inInterval(match, startInterval, endInterval) {
  return match.round >= startInterval && match.round <= endInterval;
}

function processMatch(standings, match) {
  if (!standings[match.homeTeam.id]) standings[match.homeTeam.id] = initializeTeam(match.homeTeam);
  if (!standings[match.awayTeam.id]) standings[match.awayTeam.id] = initializeTeam(match.awayTeam);
  if (match.homeScore === null || match.awayScore === null) return;
  updateTeamStats(standings[match.homeTeam.id], match.homeScore, match.awayScore);
  updateTeamStats(standings[match.awayTeam.id], match.awayScore, match.homeScore);
}

function resolveCriteria(tiebreakerCriteria) {
  if (Array.isArray(tiebreakerCriteria) && tiebreakerCriteria.length > 0) {
    return tiebreakerCriteria;
  }
  return ["GOAL_DIFFERENCE", "GOALS_FOR"];
}

function calculateStandings(matches, startInterval, endInterval, tiebreakerCriteria) {
  logger.info(`Standings for ${matches.length} matches [${startInterval}, ${endInterval}]`);
  const standings = {};

  matches
    .filter((m) => inInterval(m, startInterval, endInterval))
    .forEach((match) => processMatch(standings, match));

  const criteria = resolveCriteria(tiebreakerCriteria);
  const scoredMatches = matches.filter(
    (m) => inInterval(m, startInterval, endInterval) && m.homeScore !== null && m.awayScore !== null,
  );

  return sortByPoints(Object.values(standings), criteria, scoredMatches);
}

function assignTags(standings, metadata) {
  if (!metadata) return standings.map((s) => ({ ...s, tags: [] }));
  const n = standings.length;
  const promoted = metadata.promotionsCount || 0;
  const playoff = metadata.playoffSpotsCount || 0;
  const relegated = metadata.relegationsCount || 0;
  const playout = metadata.playoutSpotsCount || 0;

  return standings.map((entry, index) => {
    const pos = index + 1;
    const tags = [];
    if (pos <= promoted) tags.push("PROMOTED");
    else if (pos <= promoted + playoff) tags.push("PLAYOFF");
    if (pos > n - relegated) tags.push("RELEGATED");
    else if (relegated + playout > 0 && pos > n - relegated - playout) tags.push("PLAYOUT");
    return { ...entry, tags };
  });
}

module.exports = {
  calculateStandings,
  assignTags,
};
