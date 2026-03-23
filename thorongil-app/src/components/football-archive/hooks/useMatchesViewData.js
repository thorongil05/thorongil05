import { useState, useEffect, useCallback } from "react";
import { apiGet, apiDelete } from "../../../utils/api";
import { useTranslation } from "react-i18next";

export function useMatchesViewData({
  selectedEdition,
  selectedPhaseId,
  selectedGroupId,
  onMatchAdded,
}) {
  const { t } = useTranslation();
  
  const [matches, setMatches] = useState([]);
  const [matchesCount, setMatchesCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rounds, setRounds] = useState([]);
  const [selectedRound, setSelectedRound] = useState("All");
  const [selectedTeamId, setSelectedTeamId] = useState("All");
  const [sortBy, setSortBy] = useState("match_date");
  const [sortOrder, setSortOrder] = useState("asc");
  const [lastUsedRound, setLastUsedRound] = useState("");

  const contextKey = `${selectedEdition?.id}-${selectedPhaseId}-${selectedGroupId}`;
  const [activeContextKey, setActiveContextKey] = useState(contextKey);

  if (contextKey !== activeContextKey) {
    setActiveContextKey(contextKey);
    setMatches([]);
    setMatchesCount(0);
    setRounds([]);
    setSelectedRound(null);
    setError(null);
    setLoading(false);
  }

  useEffect(() => {
    if (selectedRound && selectedRound !== "All") {
      setLastUsedRound(selectedRound);
    }
  }, [selectedRound]);

  const fetchRounds = useCallback(() => {
    if (!selectedEdition) {
      setRounds([]);
      return;
    }

    const urlSearchParams = new URLSearchParams({
      editionId: selectedEdition.id,
    });
    if (selectedPhaseId) urlSearchParams.append("phaseId", selectedPhaseId);
    if (selectedGroupId) urlSearchParams.append("groupId", selectedGroupId);

    apiGet(`/api/matches/rounds?${urlSearchParams}`)
      .then(({ rounds, currentRound }) => {
        setRounds(rounds);
        setSelectedRound(currentRound ?? "All");
      })
      .catch((err) => console.error("Error fetching rounds:", err));
  }, [selectedEdition, selectedPhaseId, selectedGroupId]);

  const fetchMatches = useCallback(() => {
    if (!selectedEdition || selectedRound === null) {
      if (!selectedEdition) setMatches([]);
      return;
    }

    setError(null);
    setLoading(true);

    const params = {
      editionId: selectedEdition.id,
    };
    if (selectedRound && selectedRound !== "All") params.round = selectedRound;
    if (selectedTeamId && selectedTeamId !== "All") params.teamId = selectedTeamId;
    if (selectedPhaseId) params.phaseId = selectedPhaseId;
    if (selectedGroupId) params.groupId = selectedGroupId;
    if (sortBy) {
      params.sortBy = sortBy;
      params.sortOrder = sortOrder;
    }

    const urlSearchParams = new URLSearchParams(params);

    apiGet(`/api/matches?${urlSearchParams}`)
      .then((response) => {
        const data = response.data || response;
        const count = response.metadata?.count ?? data.length;

        setMatches(data);
        setMatchesCount(count);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching matches:", error);
        setError(error.message);
        setLoading(false);
      });
  }, [selectedEdition, selectedPhaseId, selectedGroupId, selectedRound, selectedTeamId, sortBy, sortOrder]);

  const handleResetFilters = () => {
    setSelectedRound("All");
    setSelectedTeamId("All");
    setSortBy("match_date");
    setSortOrder("asc");
  };

  const handleRequestSort = (property) => {
    const isAsc = sortBy === property && sortOrder === "asc";
    setSortOrder(isAsc ? "desc" : "asc");
    setSortBy(property);
  };

  const handleDeleteMatch = async (matchId) => {
    if (!window.confirm(t("football.confirm_delete_match", "Are you sure you want to delete this match?"))) {
      return;
    }

    try {
      await apiDelete(`/api/matches/${matchId}`);
      fetchMatches();
      fetchRounds();
      if (onMatchAdded) {
        onMatchAdded();
      }
    } catch (err) {
      console.error("Error deleting match:", err);
      alert(t("football.error_deleting_match", { defaultValue: "Error deleting match: {{message}}", message: err.message }));
    }
  };

  useEffect(() => {
    fetchRounds();
  }, [fetchRounds]);

  useEffect(() => {
    if (selectedRound !== null) {
      fetchMatches();
    }
  }, [selectedRound, fetchMatches]);

  return {
    matches,
    matchesCount,
    loading,
    error,
    rounds,
    selectedRound,
    setSelectedRound,
    selectedTeamId,
    setSelectedTeamId,
    sortBy,
    sortOrder,
    lastUsedRound,
    setLastUsedRound,
    handleResetFilters,
    handleRequestSort,
    handleDeleteMatch,
    fetchMatches,
    fetchRounds
  };
}
