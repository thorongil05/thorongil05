import { useTranslation } from "react-i18next";
import { useAuth } from "../../../context/AuthContext";
import { UserRoles } from "../../../constants/roles";
import PropTypes from "prop-types";
import { MatchStatusBadge } from "../components/MatchStatusBadge";
import { useMatchContextMenu } from "../hooks/useMatchContextMenu";
import MatchContextMenu from "../MatchContextMenu";
import { getMatchWinner, groupMatchesByDate } from "../constants/matchResult";

const getTeamNameClass = (isHighlighted, isWinner) =>
  isHighlighted ? "font-bold text-blue-400" : isWinner ? "font-bold text-slate-200" : "text-slate-200";

export default function MobileMatchesView({ matches, loading, error, handleEditMatch, handleDeleteMatch, selectedTeamId }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const canManage = user?.role === UserRoles.ADMIN || user?.role === UserRoles.EDITOR;
  const hi = (id) => id === Number(selectedTeamId);
  const { menu, closeMenu, openMenu } = useMatchContextMenu();

  if (loading) return <p className="text-sm text-slate-500 text-center py-6">Caricamento...</p>;
  if (error) return <p className="text-sm text-red-400 text-center py-6">Errore: {error}</p>;
  if (!matches.length) return <p className="text-sm text-slate-500 text-center py-6">{t("football.no_matches", "Nessuna partita trovata")}</p>;

  return (
    <>
      <div>
        {groupMatchesByDate(matches).map(({ label, items }) => (
          <div key={label ?? "no-date"}>
            <div className="px-3 py-1.5 bg-slate-800/60 border-y border-slate-700/50 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              {label ?? "Data non definita"}
            </div>
            <div className="divide-y divide-slate-800">
              {items.map((match) => {
          const showScore = match.homeScore != null || match.awayScore != null;
          const winner = getMatchWinner(match);
          const isLive = match.status === "IN_PROGRESS";
          return (
            <div key={match.id} className="flex items-stretch">
              <div className="w-8 bg-slate-800/50 flex items-center justify-center shrink-0">
                <span className="text-[9px] font-bold text-slate-500" style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}>
                  {t("football.round_short", "G.")} {match.round || "-"}
                </span>
              </div>
              <div className="flex-1 py-3 px-3 flex items-center gap-2">
                <div className="flex-1 space-y-1.5 min-w-0">
                  <span className={`text-sm truncate block ${getTeamNameClass(hi(match.homeTeam?.id), winner === "home")}`}>{match.homeTeam?.name || "?"}</span>
                  <span className={`text-sm truncate block ${getTeamNameClass(hi(match.awayTeam?.id), winner === "away")}`}>{match.awayTeam?.name || "?"}</span>
                </div>
                {showScore
                  ? <div className="flex flex-col items-center gap-1.5 shrink-0">
                      <span className="font-bold font-mono text-sm text-white">{match.homeScore ?? "—"}</span>
                      <span className="font-bold font-mono text-sm text-white">{match.awayScore ?? "—"}</span>
                      {match.status === "CANCELLED" && <MatchStatusBadge status={match.status} />}
                    </div>
                  : <div className="flex items-center gap-1.5 shrink-0">
                      <MatchStatusBadge status={match.status} />
                      {isLive && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shrink-0" />}
                    </div>}
                {canManage && (
                  <button
                    className="shrink-0 px-2 self-stretch flex items-center text-slate-600 hover:text-slate-300 active:text-slate-200 transition-colors"
                    onClick={(e) => { const r = e.currentTarget.getBoundingClientRect(); openMenu(match, r.left, r.bottom); }}
                  >···</button>
                )}
              </div>
            </div>
          );
        })}
            </div>
          </div>
        ))}
      </div>
      {menu && (
        <MatchContextMenu
          x={menu.x} y={menu.y} match={menu.match}
          onClose={closeMenu}
          onEdit={handleEditMatch}
          onDelete={handleDeleteMatch}
        />
      )}
    </>
  );
}

MobileMatchesView.propTypes = {
  matches: PropTypes.array.isRequired, loading: PropTypes.bool.isRequired, error: PropTypes.string,
  handleEditMatch: PropTypes.func.isRequired, handleDeleteMatch: PropTypes.func.isRequired,
  selectedTeamId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
