export function groupMatchesByDate(matches) {
  const map = new Map();
  for (const m of matches) {
    const label = m.matchDate
      ? new Date(m.matchDate).toLocaleDateString("it-IT", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
      : null;
    if (!map.has(label)) map.set(label, []);
    map.get(label).push(m);
  }
  const dated = [...map.entries()].filter(([k]) => k !== null).map(([label, items]) => ({ label, items }));
  const undated = map.has(null) ? [{ label: null, items: map.get(null) }] : [];
  return [...dated, ...undated];
}

export function getMatchWinner(match) {
  if (!["COMPLETED", "FORFEITED"].includes(match.status)) return null;
  if (match.homeScore == null || match.awayScore == null) return null;
  if (match.homeScore > match.awayScore) return "home";
  if (match.homeScore < match.awayScore) return "away";
  return "draw";
}
