import { useState, useEffect, useCallback } from "react";
import { apiGet } from "../../../utils/api";

export function useArchiveData() {
  const [competitions, setCompetitions] = useState([]);
  const [selectedCompetition, setSelectedCompetition] = useState(null);
  const [editions, setEditions] = useState([]);
  const [selectedEdition, setSelectedEdition] = useState(null);
  const [phases, setPhases] = useState([]);
  const [phasesLoading, setPhasesLoading] = useState(false);
  const [selectedPhaseId, setSelectedPhaseId] = useState(null);
  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [teams, setTeams] = useState([]);
  const [teamsLoading, setTeamsLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    apiGet("/api/competitions").then(setCompetitions).catch(console.error);
  }, []);

  useEffect(() => {
    if (!selectedCompetition) { setEditions([]); setSelectedEdition(null); return; }
    apiGet(`/api/competitions/${selectedCompetition.id}/editions`)
      .then((data) => { setEditions(data); setSelectedEdition(data[0] || null); })
      .catch(console.error);
  }, [selectedCompetition]);

  useEffect(() => {
    if (!selectedEdition) { setPhases([]); setSelectedPhaseId(null); return; }
    setPhasesLoading(true);
    apiGet(`/api/competitions/editions/${selectedEdition.id}/phases`)
      .then((data) => { setPhases(data); setSelectedPhaseId(data[0]?.id || null); })
      .catch(console.error)
      .finally(() => setPhasesLoading(false));
  }, [selectedEdition]);

  useEffect(() => {
    const phase = phases.find((p) => p.id === selectedPhaseId);
    if (!selectedPhaseId || phase?.type !== "GROUP") { setGroups([]); setSelectedGroupId(null); return; }
    apiGet(`/api/competitions/phases/${selectedPhaseId}/groups`)
      .then((data) => { setGroups(data); setSelectedGroupId(data[0]?.id || null); })
      .catch(console.error);
  }, [selectedPhaseId, phases]);

  const fetchTeams = useCallback((editionId) => {
    setTeamsLoading(true);
    const url = editionId ? `/api/competitions/editions/${editionId}/teams` : "/api/teams";
    apiGet(url)
      .then((d) => setTeams(d.data?.map((e) => ({ id: e.id, name: e.name, city: e.city })) || []))
      .catch(console.error)
      .finally(() => setTeamsLoading(false));
  }, []);

  useEffect(() => { fetchTeams(selectedEdition?.id); }, [selectedEdition, fetchTeams, refreshTrigger]);

  const phase = phases.find((p) => p.id === selectedPhaseId);
  const isPendingGroup = phase?.type === "GROUP" && !selectedGroupId;
  const isReady = !!selectedEdition && !phasesLoading && !isPendingGroup;

  const handlePhaseChange = (phaseId) => { setSelectedPhaseId(phaseId); setSelectedGroupId(null); };

  return {
    competitions, selectedCompetition, setSelectedCompetition,
    editions, selectedEdition, setSelectedEdition,
    phases, selectedPhaseId, handlePhaseChange,
    groups, selectedGroupId, setSelectedGroupId,
    teams, teamsLoading, fetchTeams,
    refreshTrigger, triggerRefresh: () => setRefreshTrigger((p) => p + 1),
    isReady,
  };
}
