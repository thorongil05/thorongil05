import { useState, useEffect } from "react";
import { PointerSensor, KeyboardSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import { saveMatchday } from "../matchday/saveMatchday";

function makeMatches(teams) {
  return Array.from({ length: Math.ceil(teams.length / 2) }, (_, i) => ({ id: `match-${i}`, homeTeam: null, awayTeam: null }));
}

function applySlotDrop(nm, { idx, slot, team, teamId, src, setAvailableTeams }) {
  const target = nm[parseInt(idx)];
  const existing = slot === "home" ? target.homeTeam : target.awayTeam;
  if (src) {
    const sm = nm.find((x) => x.id === src.id);
    if (sm.homeTeam?.id === teamId) sm.homeTeam = null; else sm.awayTeam = null;
    if (existing) {
      const useHome = src.homeTeam?.id === teamId || (src.homeTeam === null && src.awayTeam?.id !== teamId);
      if (useHome) sm.homeTeam = existing; else sm.awayTeam = existing;
    }
  } else {
    setAvailableTeams((a) => a.filter((t) => t.id !== teamId));
    if (existing) setAvailableTeams((a) => [...a, existing]);
  }
  if (slot === "home") target.homeTeam = team; else target.awayTeam = team;
}

export function useMatchdayBuilder({
  open, teams, defaultRound, selectedEdition,
  selectedPhaseId, selectedGroupId, onMatchesCreated, onClose,
}) {
  const [round, setRound] = useState(defaultRound || "");
  const [availableTeams, setAvailableTeams] = useState([]);
  const [matches, setMatches] = useState([]);
  const [activeTeam, setActiveTeam] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } }),
    useSensor(KeyboardSensor)
  );

  useEffect(() => {
    if (open) { setAvailableTeams([...teams]); setMatches(makeMatches(teams)); setRound(defaultRound || ""); setError(null); }
  }, [open, teams, defaultRound]);

  const handleDragStart = (e) => {
    const id = parseInt(e.active.id.toString().replace("team-", ""));
    setActiveTeam(teams.find((t) => t.id === id) || null);
  };

  const handleDragEnd = ({ active, over }) => {
    setActiveTeam(null);
    if (!over) return;
    const teamId = parseInt(active.id.toString().replace("team-", ""));
    const team = teams.find((t) => t.id === teamId);
    const src = matches.find((m) => m.homeTeam?.id === teamId || m.awayTeam?.id === teamId);

    if (over.id === "available-area") {
      if (!src) return;
      setMatches((prev) => { const nm = [...prev]; const m = nm.find((x) => x.id === src.id); if (m.homeTeam?.id === teamId) m.homeTeam = null; else m.awayTeam = null; return nm; });
      setAvailableTeams((a) => [...a, team]);
      return;
    }
    if (!over.id.toString().startsWith("match-")) return;
    const [, idx, slot] = over.id.toString().split("-");
    setMatches((prev) => { const nm = [...prev]; applySlotDrop(nm, { idx, slot, team, teamId, src, setAvailableTeams }); return nm; });
  };

  const addTeamToFirstSlot = (teamId) => {
    const team = availableTeams.find((t) => t.id === teamId);
    if (!team) return;
    setMatches((prev) => {
      const nm = prev.map((m) => ({ ...m }));
      let placed = false;
      for (const match of nm) {
        if (!match.homeTeam) { match.homeTeam = team; placed = true; break; }
        if (!match.awayTeam) { match.awayTeam = team; placed = true; break; }
      }
      if (placed) setAvailableTeams((a) => a.filter((t) => t.id !== teamId));
      return nm;
    });
  };

  const removeFromSlot = (matchId, slotType) => {
    setMatches((prev) => {
      const nm = [...prev];
      const m = nm.find((x) => x.id === matchId);
      const t = slotType === "home" ? m.homeTeam : m.awayTeam;
      if (t) { setAvailableTeams((a) => [...a, t]); if (slotType === "home") m.homeTeam = null; else m.awayTeam = null; }
      return nm;
    });
  };

  const resetBuilder = () => { setAvailableTeams([...teams]); setMatches(makeMatches(teams)); setError(null); };
  const handleSave = () => saveMatchday({ matches, round, selectedEdition, selectedPhaseId, selectedGroupId, setIsSubmitting, setError, onMatchesCreated, onClose });

  return { round, setRound, availableTeams, matches, activeTeam, isSubmitting, error, sensors, handleDragStart, handleDragEnd, addTeamToFirstSlot, removeFromSlot, resetBuilder, handleSave };
}
