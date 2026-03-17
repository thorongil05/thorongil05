import { useTranslation } from "react-i18next";
import { useAuth } from "../../../context/AuthContext";
import { UserRoles } from "../../../constants/roles";
import PropTypes from "prop-types";
import { MatchStatusBadge } from "../components/MatchStatusBadge";

export default function MobileMatchesView({ matches, loading, error, handleEditMatch, handleDeleteMatch, selectedTeamId }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const canManage = user?.role === UserRoles.ADMIN || user?.role === UserRoles.EDITOR;
  const hi = (id) => id === Number(selectedTeamId);

  if (loading) return <p className="text-sm text-slate-500 text-center py-6">Caricamento...</p>;
  if (error) return <p className="text-sm text-red-400 text-center py-6">Errore: {error}</p>;
  if (!matches.length) return <p className="text-sm text-slate-500 text-center py-6">{t("football.no_matches", "Nessuna partita trovata")}</p>;

  return (
    <div className="divide-y divide-slate-800">
      {matches.map((match) => (
        <div key={match.id} className="flex items-stretch">
          <div className="w-8 bg-slate-800/50 flex items-center justify-center shrink-0">
            <span className="text-[9px] font-bold text-slate-500" style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}>
              {t("football.round_short", "G.")} {match.round || "-"}
            </span>
          </div>
          <div className="flex-1 py-3 px-3 space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <span className={`text-sm truncate ${hi(match.homeTeam?.id) ? "font-bold text-blue-400" : "text-slate-200"}`}>{match.homeTeam?.name || "?"}</span>
              <span className="font-bold font-mono text-white text-sm shrink-0">{match.homeScore ?? "—"}</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className={`text-sm truncate ${hi(match.awayTeam?.id) ? "font-bold text-blue-400" : "text-slate-400"}`}>{match.awayTeam?.name || "?"}</span>
              <span className="font-bold font-mono text-white text-sm shrink-0">{match.awayScore ?? "—"}</span>
            </div>
            {match.status && match.status !== "COMPLETED" && (
              <div><MatchStatusBadge status={match.status} /></div>
            )}
          </div>
          {canManage && (
            <div className="flex flex-col justify-center gap-2 px-3 shrink-0">
              <button onClick={() => handleEditMatch(match)} className="text-slate-600 hover:text-blue-400 active:text-blue-400 text-xs p-1">✎</button>
              <button onClick={() => handleDeleteMatch(match.id)} className="text-slate-600 hover:text-red-400 active:text-red-400 text-xs p-1">✕</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

MobileMatchesView.propTypes = {
  matches: PropTypes.array.isRequired, loading: PropTypes.bool.isRequired, error: PropTypes.string,
  handleEditMatch: PropTypes.func.isRequired, handleDeleteMatch: PropTypes.func.isRequired,
  selectedTeamId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
