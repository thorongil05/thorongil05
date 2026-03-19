import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { apiPut, apiPost } from "../../utils/api";
import { ScoreSelector } from "./components/ScoreSelector";
import { STATUS_OPTIONS } from "./constants/matchStatus";
import { MATCH_DIALOG_MODE as MODE } from "./constants/matchDialogModes";

const selectCls = "w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500";

const TITLES = {
  [MODE.INSERT]: "Aggiungi Partita",
  [MODE.UPDATE_SCORE]: "Aggiorna Risultato",
  [MODE.UPDATE_TEAMS]: "Modifica Squadre",
  [MODE.UPDATE_DATE]: "Modifica Giornata / Data",
};

const computeGoals = (match, forfeitWinner) => ({
  homeGoals: match.status === "FORFEITED" ? (forfeitWinner === "home" ? 3 : 0) : match.homeScore,
  awayGoals: match.status === "FORFEITED" ? (forfeitWinner === "away" ? 3 : 0) : match.awayScore,
});

const buildBase = (m) => ({
  editionId: m.editionId, phaseId: m.phaseId, groupId: m.groupId,
  homeTeamId: m.homeTeam?.id, awayTeamId: m.awayTeam?.id,
  homeGoals: m.homeScore, awayGoals: m.awayScore,
  round: m.round, matchDate: m.matchDate, status: m.status,
});

function TeamsSelector({ homeTeamId, awayTeamId, onHome, onAway, teams, disabled }) {
  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs text-slate-500 mb-1.5">Casa</label>
        <select value={homeTeamId} onChange={(e) => onHome(e.target.value)} disabled={disabled} className={selectCls}>
          <option value="">Seleziona squadra...</option>
          {teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-xs text-slate-500 mb-1.5">Ospite</label>
        <select value={awayTeamId} onChange={(e) => onAway(e.target.value)} disabled={disabled} className={selectCls}>
          <option value="">Seleziona squadra...</option>
          {teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
      </div>
    </div>
  );
}

function TeamsHeader({ matchToEdit, round }) {
  return (
    <div className="text-center py-3 border-b border-slate-700/60">
      <div className="flex items-center justify-center gap-3 mb-1">
        <span className="font-bold text-white text-base flex-1 text-right leading-tight">{matchToEdit.homeTeam?.name}</span>
        <span className="text-slate-500 text-sm font-medium shrink-0">VS</span>
        <span className="font-bold text-white text-base flex-1 text-left leading-tight">{matchToEdit.awayTeam?.name}</span>
      </div>
      {round && <p className="text-xs text-slate-500 mt-0.5">Giornata {round}</p>}
    </div>
  );
}

function StatusSelect({ status, onChange, disabled }) {
  return (
    <div>
      <label className="block text-xs text-slate-500 mb-1.5">Stato</label>
      <select value={status} onChange={(e) => onChange(e.target.value)} disabled={disabled} className={selectCls}>
        {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

function ForfeitSelect({ matchToEdit, winner, onChange, disabled }) {
  const btnCls = (side) => `flex-1 py-2 rounded-lg text-sm font-medium transition-colors border ${winner === side ? "bg-blue-600 border-blue-500 text-white" : "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600"}`;
  return (
    <div>
      <label className="block text-xs text-slate-500 mb-1.5">Vittoria a tavolino</label>
      <div className="flex gap-2">
        <button type="button" onClick={() => onChange("home")} disabled={disabled} className={btnCls("home")}>{matchToEdit.homeTeam?.name} <span className="text-xs opacity-60">(3-0)</span></button>
        <button type="button" onClick={() => onChange("away")} disabled={disabled} className={btnCls("away")}>{matchToEdit.awayTeam?.name} <span className="text-xs opacity-60">(0-3)</span></button>
      </div>
    </div>
  );
}

function ScoreRow({ matchToEdit, match, setMatch, disabled }) {
  return (
    <div className="flex items-center justify-center gap-4">
      <div className="flex flex-col items-center gap-1.5">
        <span className="text-xs text-slate-500">{matchToEdit.homeTeam?.name?.split(" ")[0]}</span>
        <ScoreSelector value={match.homeScore} onChange={(v) => setMatch((p) => ({ ...p, homeScore: v }))} disabled={disabled} />
      </div>
      <span className="text-slate-600 text-2xl font-bold mt-5">–</span>
      <div className="flex flex-col items-center gap-1.5">
        <span className="text-xs text-slate-500">{matchToEdit.awayTeam?.name?.split(" ")[0]}</span>
        <ScoreSelector value={match.awayScore} onChange={(v) => setMatch((p) => ({ ...p, awayScore: v }))} disabled={disabled} />
      </div>
    </div>
  );
}

function MatchMetaFields({ match, setMatch, disabled }) {
  return (
    <div className="flex gap-3">
      <div className="flex-1">
        <label className="block text-xs text-slate-500 mb-1.5">Giornata</label>
        <input className={selectCls} value={match.round} onChange={(e) => setMatch((p) => ({ ...p, round: e.target.value }))} disabled={disabled} />
      </div>
      <div className="flex-1">
        <label className="block text-xs text-slate-500 mb-1.5">Data</label>
        <input type="date" className={selectCls} value={match.matchDate} onChange={(e) => setMatch((p) => ({ ...p, matchDate: e.target.value }))} disabled={disabled} />
      </div>
    </div>
  );
}

export default function MatchDialog({ open, onClose, onMatchUpdated, mode, matchToEdit, teams, selectedEdition, selectedPhaseId, selectedGroupId }) {
  const [match, setMatch] = useState({ homeScore: null, awayScore: null, round: "", matchDate: "", status: "SCHEDULED" });
  const [forfeitWinner, setForfeitWinner] = useState(null);
  const [homeTeamId, setHomeTeamId] = useState("");
  const [awayTeamId, setAwayTeamId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!open) return;
    if (matchToEdit) {
      setMatch({ homeScore: matchToEdit.homeScore, awayScore: matchToEdit.awayScore, round: matchToEdit.round || "", matchDate: matchToEdit.matchDate ? matchToEdit.matchDate.split("T")[0] : "", status: matchToEdit.status || "SCHEDULED" });
      setForfeitWinner(matchToEdit.status === "FORFEITED" ? (matchToEdit.homeScore === 3 ? "home" : "away") : null);
      setHomeTeamId(String(matchToEdit.homeTeam?.id || ""));
      setAwayTeamId(String(matchToEdit.awayTeam?.id || ""));
    } else {
      setMatch({ homeScore: null, awayScore: null, round: "", matchDate: "", status: "SCHEDULED" });
      setHomeTeamId(""); setAwayTeamId("");
    }
    setError(null);
  }, [open, matchToEdit]);

  const handleStatusChange = (status) => { setMatch((p) => ({ ...p, status, homeScore: null, awayScore: null })); setForfeitWinner(null); };

  const handleSubmit = async () => {
    const needsTeams = mode === MODE.INSERT || mode === MODE.UPDATE_TEAMS;
    if (needsTeams && (!homeTeamId || !awayTeamId)) { setError("Seleziona entrambe le squadre."); return; }
    if (needsTeams && homeTeamId === awayTeamId) { setError("Le squadre devono essere diverse."); return; }
    setIsSubmitting(true); setError(null);
    try {
      if (mode === MODE.INSERT) {
        await apiPost("/api/matches", { homeTeamId: Number(homeTeamId), awayTeamId: Number(awayTeamId), round: match.round, matchDate: match.matchDate ? new Date(match.matchDate).toISOString() : null, editionId: selectedEdition.id, phaseId: selectedPhaseId || null, groupId: selectedGroupId || null, status: "SCHEDULED" });
      } else {
        const base = buildBase(matchToEdit);
        const { homeGoals, awayGoals } = computeGoals(match, forfeitWinner);
        const payload = mode === MODE.UPDATE_SCORE
          ? { ...base, homeGoals, awayGoals, status: match.status }
          : mode === MODE.UPDATE_TEAMS
            ? { ...base, homeTeamId: Number(homeTeamId), awayTeamId: Number(awayTeamId) }
            : { ...base, round: match.round, matchDate: match.matchDate ? new Date(match.matchDate).toISOString() : matchToEdit.matchDate };
        await apiPut(`/api/matches/${matchToEdit.id}`, payload);
      }
      onMatchUpdated(match.round);
      onClose();
    } catch { setError("Errore durante il salvataggio."); } finally { setIsSubmitting(false); }
  };

  if (!open) return null;
  const showScores = ["COMPLETED", "IN_PROGRESS"].includes(match.status);
  const needsTeams = mode === MODE.INSERT || mode === MODE.UPDATE_TEAMS;
  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full sm:max-w-md bg-slate-900 border border-slate-700 rounded-t-2xl sm:rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-800">✕</button>
          <h2 className="text-sm font-semibold text-white">{TITLES[mode]}</h2>
          <button onClick={handleSubmit} disabled={isSubmitting} className="text-blue-400 hover:text-blue-300 font-semibold text-sm disabled:opacity-50 transition-colors px-2">{isSubmitting ? "..." : "Salva"}</button>
        </div>
        <div className="px-4 pt-3 pb-20 sm:pb-4 flex flex-col gap-4">
          {error && <p className="text-red-400 text-xs text-center">{error}</p>}
          {!needsTeams && matchToEdit && <TeamsHeader matchToEdit={matchToEdit} round={match.round} />}
          {needsTeams && <TeamsSelector homeTeamId={homeTeamId} awayTeamId={awayTeamId} onHome={setHomeTeamId} onAway={setAwayTeamId} teams={teams || []} disabled={isSubmitting} />}
          {mode === MODE.UPDATE_TEAMS && <button type="button" onClick={() => { const h = homeTeamId; setHomeTeamId(awayTeamId); setAwayTeamId(h); }} disabled={isSubmitting} className="w-full py-2 text-sm text-slate-400 border border-slate-700 rounded-lg hover:border-slate-500 hover:text-white transition-all">⇄ Inverti casa / ospite</button>}
          {mode === MODE.UPDATE_SCORE && <StatusSelect status={match.status} onChange={handleStatusChange} disabled={isSubmitting} />}
          {mode === MODE.UPDATE_SCORE && showScores && <ScoreRow matchToEdit={matchToEdit} match={match} setMatch={setMatch} disabled={isSubmitting} />}
          {mode === MODE.UPDATE_SCORE && match.status === "FORFEITED" && <ForfeitSelect matchToEdit={matchToEdit} winner={forfeitWinner} onChange={setForfeitWinner} disabled={isSubmitting} />}
          {(mode === MODE.INSERT || mode === MODE.UPDATE_DATE) && <MatchMetaFields match={match} setMatch={setMatch} disabled={isSubmitting} />}
        </div>
      </div>
    </div>
  );
}

MatchDialog.propTypes = { open: PropTypes.bool.isRequired, onClose: PropTypes.func.isRequired, onMatchUpdated: PropTypes.func.isRequired, mode: PropTypes.string.isRequired, matchToEdit: PropTypes.object, teams: PropTypes.array, selectedEdition: PropTypes.object, selectedPhaseId: PropTypes.number, selectedGroupId: PropTypes.number };
TeamsSelector.propTypes = { homeTeamId: PropTypes.string.isRequired, awayTeamId: PropTypes.string.isRequired, onHome: PropTypes.func.isRequired, onAway: PropTypes.func.isRequired, teams: PropTypes.array.isRequired, disabled: PropTypes.bool };
TeamsHeader.propTypes = { matchToEdit: PropTypes.object.isRequired, round: PropTypes.string };
StatusSelect.propTypes = { status: PropTypes.string.isRequired, onChange: PropTypes.func.isRequired, disabled: PropTypes.bool };
ForfeitSelect.propTypes = { matchToEdit: PropTypes.object.isRequired, winner: PropTypes.string, onChange: PropTypes.func.isRequired, disabled: PropTypes.bool };
ScoreRow.propTypes = { matchToEdit: PropTypes.object.isRequired, match: PropTypes.object.isRequired, setMatch: PropTypes.func.isRequired, disabled: PropTypes.bool };
MatchMetaFields.propTypes = { match: PropTypes.object.isRequired, setMatch: PropTypes.func.isRequired, disabled: PropTypes.bool };
