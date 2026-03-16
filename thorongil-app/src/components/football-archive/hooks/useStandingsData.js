import { useState, useEffect, useMemo } from "react";
import { apiGet } from "../../../utils/api";

function cmp(a, b, sortBy, sortOrder) {
  let av = sortBy === "teamName" ? (a[sortBy] || "").toLowerCase() : a[sortBy];
  let bv = sortBy === "teamName" ? (b[sortBy] || "").toLowerCase() : b[sortBy];
  if (av !== bv) return (av < bv ? -1 : 1) * (sortOrder === "asc" ? 1 : -1);
  if (sortBy !== "points" && a.points !== b.points) return a.points > b.points ? -1 : 1;
  if (sortBy !== "goalDifference" && a.goalDifference !== b.goalDifference) return a.goalDifference > b.goalDifference ? -1 : 1;
  return 0;
}

export function useStandingsData({ selectedEdition, selectedPhaseId, selectedGroupId, refreshTrigger }) {
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [roundsInterval, setRoundsInterval] = useState([1, 0]);
  const [sliderValue, setSliderValue] = useState([1, 0]);
  const [maxRound, setMaxRound] = useState(0);
  const [lastFetchedInterval, setLastFetchedInterval] = useState(null);
  const [sortBy, setSortBy] = useState("points");
  const [sortOrder, setSortOrder] = useState("desc");

  const contextKey = `${selectedEdition?.id}-${selectedPhaseId}-${selectedGroupId}`;
  const [activeContextKey, setActiveContextKey] = useState(contextKey);
  if (contextKey !== activeContextKey) {
    setActiveContextKey(contextKey);
    setRoundsInterval([1, 0]); setSliderValue([1, 0]); setLastFetchedInterval(null);
    setMaxRound(0); setSortBy("points"); setSortOrder("desc"); setStandings([]);
  }

  const handleSort = (col) => { setSortBy(col); setSortOrder(sortBy === col && sortOrder === "asc" ? "desc" : "asc"); };
  const resetSorting = () => { setSortBy("points"); setSortOrder("desc"); };
  const handleSliderChange = (_, v) => setSliderValue(v);
  const handleIntervalChange = (_, v) => setRoundsInterval(v);

  useEffect(() => {
    if (!selectedEdition) { setStandings([]); return; }
    if (lastFetchedInterval && roundsInterval[0] === lastFetchedInterval[0] && roundsInterval[1] === lastFetchedInterval[1]) return;
    setLoading(true); setError(null);
    const p = new URLSearchParams();
    if (roundsInterval[1] > 0) { p.append("startInterval", roundsInterval[0]); p.append("endInterval", roundsInterval[1]); }
    if (selectedPhaseId) p.append("phaseId", selectedPhaseId);
    if (selectedGroupId) p.append("groupId", selectedGroupId);
    apiGet(`/api/competitions/editions/${selectedEdition.id}/standings${p.toString() ? `?${p}` : ""}`)
      .then((res) => {
        setStandings(res.standings);
        setMaxRound(res.totalRounds);
        if (roundsInterval[1] === 0) {
          const full = [1, Math.max(1, res.totalRounds || 1)];
          setSliderValue(full); setRoundsInterval(full); setLastFetchedInterval(full);
        } else { setLastFetchedInterval(roundsInterval); }
        setLoading(false);
      })
      .catch((err) => { setError(err.message); setLoading(false); });
  }, [selectedEdition, selectedPhaseId, selectedGroupId, roundsInterval, refreshTrigger, lastFetchedInterval]);

  const sortedStandings = useMemo(
    () => standings.length ? [...standings].sort((a, b) => cmp(a, b, sortBy, sortOrder)) : [],
    [standings, sortBy, sortOrder]
  );

  return { sortedStandings, loading, error, sliderValue, handleSliderChange, handleIntervalChange, maxRound, sortBy, sortOrder, handleSort, resetSorting };
}
