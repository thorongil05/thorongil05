import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { apiPut } from "../../utils/api";
import { ScoreSelector } from "./components/ScoreSelector";
import { STATUS_OPTIONS } from "./constants/matchStatus";

function TeamsHeader({ matchToEdit, round }) {
  return (
    <div className="text-center py-3 border-b border-slate-700/60">
      <div className="flex items-center justify-center gap-3 mb-1">
        <span className="font-bold text-white text-base flex-1 text-right leading-tight">
          {matchToEdit.homeTeam?.name}
        </span>
        <span className="text-slate-500 text-sm font-medium shrink-0">VS</span>
        <span className="font-bold text-white text-base flex-1 text-left leading-tight">
          {matchToEdit.awayTeam?.name}
        </span>
      </div>
      {round && <p className="text-xs text-slate-500 mt-0.5">Giornata {round}</p>}
    </div>
  );
}

function StatusSelect({ status, onChange, disabled }) {
  return (
    <div>
      <label className="block text-xs text-slate-500 mb-1.5">Stato</label>
      <select
        value={status}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
      >
        {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

function ForfeitSelect({ matchToEdit, winner, onChange, disabled }) {
  const btnCls = (side) => `flex-1 py-2 rounded-lg text-sm font-medium transition-colors border ${
    winner === side
      ? "bg-blue-600 border-blue-500 text-white"
      : "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600"
  }`;
  return (
    <div>
      <label className="block text-xs text-slate-500 mb-1.5">Vittoria a tavolino</label>
      <div className="flex gap-2">
        <button type="button" onClick={() => onChange("home")} disabled={disabled} className={btnCls("home")}>
          {matchToEdit.homeTeam?.name} <span className="text-xs opacity-60">(3-0)</span>
        </button>
        <button type="button" onClick={() => onChange("away")} disabled={disabled} className={btnCls("away")}>
          {matchToEdit.awayTeam?.name} <span className="text-xs opacity-60">(0-3)</span>
        </button>
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
        <input
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
          value={match.round}
          onChange={(e) => setMatch((p) => ({ ...p, round: e.target.value }))}
          disabled={disabled}
        />
      </div>
      <div className="flex-1">
        <label className="block text-xs text-slate-500 mb-1.5">Data</label>
        <input
          type="date"
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
          value={match.matchDate}
          onChange={(e) => setMatch((p) => ({ ...p, matchDate: e.target.value }))}
          disabled={disabled}
        />
      </div>
    </div>
  );
}

export default function MatchDialog({ open, onClose, onMatchUpdated, matchToEdit }) {
  const [match, setMatch] = useState({ homeScore: null, awayScore: null, round: "", matchDate: "", status: "SCHEDULED" });
  const [forfeitWinner, setForfeitWinner] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open && matchToEdit) {
      setMatch({
        homeScore: matchToEdit.homeScore,
        awayScore: matchToEdit.awayScore,
        round: matchToEdit.round || "",
        matchDate: matchToEdit.matchDate ? matchToEdit.matchDate.split("T")[0] : "",
        status: matchToEdit.status || "SCHEDULED",
      });
      setForfeitWinner(matchToEdit.status === "FORFEITED" ? (matchToEdit.homeScore === 3 ? "home" : "away") : null);
      setError(null);
    }
  }, [open, matchToEdit]);

  const handleStatusChange = (status) => {
    setMatch((p) => ({ ...p, status, homeScore: null, awayScore: null }));
    setForfeitWinner(null);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    const homeGoals = match.status === "FORFEITED" ? (forfeitWinner === "home" ? 3 : 0) : match.homeScore;
    const awayGoals = match.status === "FORFEITED" ? (forfeitWinner === "away" ? 3 : 0) : match.awayScore;
    const matchData = {
      ...matchToEdit,
      homeGoals, awayGoals, round: match.round, status: match.status,
      matchDate: match.matchDate ? new Date(match.matchDate).toISOString() : matchToEdit.matchDate,
      homeTeamId: matchToEdit.homeTeam?.id,
      awayTeamId: matchToEdit.awayTeam?.id,
    };
    try {
      await apiPut(`/api/matches/${matchToEdit.id}`, matchData);
      onMatchUpdated(match.round);
      onClose();
    } catch {
      setError("Errore durante il salvataggio.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open || !matchToEdit) return null;
  const showScores = ["COMPLETED", "IN_PROGRESS"].includes(match.status);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full sm:max-w-md bg-slate-900 border border-slate-700 rounded-t-2xl sm:rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-800">✕</button>
          <h2 className="text-sm font-semibold text-white">Aggiorna Partita</h2>
          <button onClick={handleSubmit} disabled={isSubmitting} className="text-blue-400 hover:text-blue-300 font-semibold text-sm disabled:opacity-50 transition-colors px-2">
            {isSubmitting ? "..." : "Salva"}
          </button>
        </div>
        <div className="px-4 pt-3 pb-8 sm:pb-4 flex flex-col gap-4">
          <TeamsHeader matchToEdit={matchToEdit} round={match.round} />
          {error && <p className="text-red-400 text-xs text-center">{error}</p>}
          <StatusSelect status={match.status} onChange={handleStatusChange} disabled={isSubmitting} />
          {showScores && <ScoreRow matchToEdit={matchToEdit} match={match} setMatch={setMatch} disabled={isSubmitting} />}
          {match.status === "FORFEITED" && <ForfeitSelect matchToEdit={matchToEdit} winner={forfeitWinner} onChange={setForfeitWinner} disabled={isSubmitting} />}
          <MatchMetaFields match={match} setMatch={setMatch} disabled={isSubmitting} />
        </div>
      </div>
    </div>
  );
}

MatchDialog.propTypes = { open: PropTypes.bool.isRequired, onClose: PropTypes.func.isRequired, onMatchUpdated: PropTypes.func.isRequired, matchToEdit: PropTypes.object, selectedEdition: PropTypes.object };
TeamsHeader.propTypes = { matchToEdit: PropTypes.object.isRequired, round: PropTypes.string };
StatusSelect.propTypes = { status: PropTypes.string.isRequired, onChange: PropTypes.func.isRequired, disabled: PropTypes.bool };
ForfeitSelect.propTypes = { matchToEdit: PropTypes.object.isRequired, winner: PropTypes.string, onChange: PropTypes.func.isRequired, disabled: PropTypes.bool };
ScoreRow.propTypes = { matchToEdit: PropTypes.object.isRequired, match: PropTypes.object.isRequired, setMatch: PropTypes.func.isRequired, disabled: PropTypes.bool };
MatchMetaFields.propTypes = { match: PropTypes.object.isRequired, setMatch: PropTypes.func.isRequired, disabled: PropTypes.bool };
