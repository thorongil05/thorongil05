import { apiPost } from "../../../utils/api";

export async function saveMatchday({
  matches,
  round,
  selectedEdition,
  selectedPhaseId,
  selectedGroupId,
  setIsSubmitting,
  setError,
  onMatchesCreated,
  onClose,
}) {
  if (!round) {
    setError("Specifica il numero della giornata");
    return;
  }
  const pairs = matches.filter((m) => m.homeTeam && m.awayTeam);
  if (!pairs.length) {
    setError("Crea almeno un accoppiamento");
    return;
  }
  setIsSubmitting(true);
  setError(null);
  const data = pairs.map((m) => ({
    homeTeamId: m.homeTeam.id,
    awayTeamId: m.awayTeam.id,
    homeGoals: null,
    awayGoals: null,
    matchDate: new Date().toISOString(),
    editionId: selectedEdition.id,
    phaseId: selectedPhaseId,
    groupId: selectedGroupId,
    round,
  }));
  try {
    await apiPost("/api/matches", data);
    onMatchesCreated(round);
    onClose();
  } catch (err) {
    console.error(err);
    setError("Errore durante il salvataggio.");
  } finally {
    setIsSubmitting(false);
  }
}
