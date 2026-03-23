function getGroupKey(matchDate) {
  const d = new Date(matchDate);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}-${d.getHours()}-${d.getMinutes()}`;
}

function getGroupLabel(matchDate) {
  const d = new Date(matchDate);
  const date = d.toLocaleDateString("it-IT", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const h = d.getHours(), min = d.getMinutes();
  const time = (h !== 0 || min !== 0) ? ` · ${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}` : "";
  return date + time;
}

export function groupMatchesByDate(matches) {
  const map = new Map();
  for (const m of matches) {
    const key = m.matchDate ? getGroupKey(m.matchDate) : null;
    if (!map.has(key)) map.set(key, { label: m.matchDate ? getGroupLabel(m.matchDate) : null, items: [] });
    map.get(key).items.push(m);
  }
  const dated = [...map.entries()].filter(([k]) => k !== null).map(([, g]) => g);
  const undated = map.has(null) ? [map.get(null)] : [];
  return [...dated, ...undated];
}

export function getMatchWinner(match) {
  if (!["COMPLETED", "FORFEITED"].includes(match.status)) return null;
  if (match.homeScore == null || match.awayScore == null) return null;
  if (match.homeScore > match.awayScore) return "home";
  if (match.homeScore < match.awayScore) return "away";
  return "draw";
}
