import { useState, useEffect, useRef } from "react";
import { apiGet, apiPost, apiPut } from "../../utils/api";

function validateMatch(match) {
  if (!match.homeTeam || !match.awayTeam) return "Please select both home and away teams";
  if (match.homeTeamScore === null || match.awayTeamScore === null) return "Please enter scores for both teams";
  return null;
}

function buildMatchData(match, selectedEdition) {
  return {
    homeTeamId: match.homeTeam.id,
    awayTeamId: match.awayTeam.id,
    homeGoals: match.homeTeamScore,
    awayGoals: match.awayTeamScore,
    matchDate: new Date().toISOString(),
    editionId: selectedEdition.id,
    phaseId: match.phaseId,
    groupId: match.groupId,
    round: match.round,
  };
}

export function useMatchForm({
  matchToEdit,
  defaultRound,
  selectedEdition,
  selectedPhaseId,
  selectedGroupId,
  open,
  onMatchAdded,
  onClose,
  teams,
}) {
  const homeTeamRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitCompleted, setSubmitCompleted] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [addAnother, setAddAnother] = useState(false);
  const [roundMatches, setRoundMatches] = useState([]);
  const [roundRefreshTrigger, setRoundRefreshTrigger] = useState(0);
  const [homeTeamOptions, setHomeTeamOptions] = useState([]);
  const [awayTeamOptions, setAwayTeamOptions] = useState([]);

  const [match, setMatch] = useState({
    homeTeam: null,
    awayTeam: null,
    homeTeamScore: null,
    awayTeamScore: null,
    round: "",
    phaseId: null,
    groupId: null,
  });

  // Initial set/reset
  useEffect(() => {
    if (open) {
      if (matchToEdit) {
        setMatch({
          homeTeam: matchToEdit.homeTeam,
          awayTeam: matchToEdit.awayTeam,
          homeTeamScore: matchToEdit.homeScore,
          awayTeamScore: matchToEdit.awayScore,
          round: matchToEdit.round,
          phaseId: matchToEdit.phaseId,
          groupId: matchToEdit.groupId,
        });
        setAddAnother(false);
      } else {
        setMatch({
          homeTeam: null,
          awayTeam: null,
          homeTeamScore: null,
          awayTeamScore: null,
          round: defaultRound || "",
          phaseId: selectedPhaseId || null,
          groupId: selectedGroupId || null,
        });
        setAddAnother(true); // Default to true for batch entry in Add mode?
      }
      setSubmitError(null);
    }
  }, [open, matchToEdit, defaultRound, selectedPhaseId, selectedGroupId]);

  // Fetch round matches
  useEffect(() => {
    const roundToFetch = match.round?.toString().trim();
    if (open && selectedEdition && roundToFetch && roundToFetch !== "All") {
      const params = new URLSearchParams({
        editionId: selectedEdition.id,
        round: roundToFetch
      });
      if (selectedPhaseId) params.append("phaseId", selectedPhaseId);
      if (selectedGroupId) params.append("groupId", selectedGroupId);
      apiGet(`/api/matches?${params}`)
        .then(response => {
          const data = response.data || response;
          setRoundMatches(data);
        })
        .catch(err => console.error("Error fetching round matches:", err));
    } else {
      setRoundMatches([]);
    }
  }, [open, selectedEdition, match.round, roundRefreshTrigger, selectedPhaseId, selectedGroupId]);

  // Update options
  useEffect(() => {
    const playedTeamIds = new Set(
      roundMatches
        .filter(rm => !matchToEdit || rm.id !== matchToEdit.id)
        .flatMap(rm => [
          rm.homeTeamId || rm.homeTeam?.id,
          rm.awayTeamId || rm.awayTeam?.id
        ])
        .filter(id => id !== undefined && id !== null)
    );

    setHomeTeamOptions(
      teams.filter((team) =>
        (!match.awayTeam || team.id !== match.awayTeam.id) &&
        !playedTeamIds.has(team.id)
      ),
    );

    setAwayTeamOptions(
      teams.filter((team) =>
        (!match.homeTeam || team.id !== match.homeTeam.id) &&
        !playedTeamIds.has(team.id)
      ),
    );
  }, [match.awayTeam, match.homeTeam, teams, roundMatches, matchToEdit]);

  const handleSubmit = async (event) => {
    if (event) event.preventDefault();
    setSubmitError(null);

    const validationError = validateMatch(match);
    if (validationError) {
      setSubmitError(validationError);
      return;
    }

    setIsSubmitting(true);
    const matchData = buildMatchData(match, selectedEdition);

    try {
      if (matchToEdit) {
        await apiPut(`/api/matches/${matchToEdit.id}`, matchData);
      } else {
        await apiPost(`/api/matches`, matchData);
      }

      if (onMatchAdded) onMatchAdded(match.round);

      if (!addAnother || matchToEdit) {
        onClose();
      } else {
        setMatch({ homeTeam: null, awayTeam: null, homeTeamScore: null, awayTeamScore: null, round: match.round, phaseId: match.phaseId, groupId: match.groupId });
        setSubmitCompleted(true);
        setRoundRefreshTrigger(prev => prev + 1);
      }
    } catch (error) {
      console.error(`Error ${matchToEdit ? "updating" : "creating"} match:`, error);
      setSubmitError(error.message || `Failed to ${matchToEdit ? "update" : "create"} match`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    match,
    setMatch,
    homeTeamOptions,
    awayTeamOptions,
    isSubmitting,
    submitCompleted,
    setSubmitCompleted,
    submitError,
    addAnother,
    setAddAnother,
    roundMatches,
    handleSubmit,
    homeTeamRef,
  };
}
