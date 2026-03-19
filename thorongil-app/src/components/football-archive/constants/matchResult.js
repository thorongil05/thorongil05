export function getMatchWinner(match) {
  if (!["COMPLETED", "FORFEITED"].includes(match.status)) return null;
  if (match.homeScore == null || match.awayScore == null) return null;
  if (match.homeScore > match.awayScore) return "home";
  if (match.homeScore < match.awayScore) return "away";
  return "draw";
}
