import { useTranslation } from "react-i18next";
import { useAuth } from "../../../context/AuthContext";
import { UserRoles } from "../../../constants/roles";
import PropTypes from "prop-types";
import { MatchStatusBadge } from "../components/MatchStatusBadge";
import { useMatchContextMenu } from "../hooks/useMatchContextMenu";
import MatchContextMenu from "../MatchContextMenu";
import { getMatchWinner } from "../constants/matchResult";

export default function MobileMatchesView({ matches, loading, error, handleEditMatch, handleDeleteMatch, selectedTeamId }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const canManage = user?.role === UserRoles.ADMIN || user?.role === UserRoles.EDITOR;
  const hi = (id) => id === Number(selectedTeamId);
  const { menu, closeMenu, getLongPressProps } = useMatchContextMenu();

  if (loading) return <p className="text-sm text-slate-500 text-center py-6">Caricamento...</p>;
  if (error) return <p className="text-sm text-red-400 text-center py-6">Errore: {error}</p>;
  if (!matches.length) return <p className="text-sm text-slate-500 text-center py-6">{t("football.no_matches", "Nessuna partita trovata")}</p>;

  return (
    <>
      <div className="divide-y divide-slate-800">
        {matches.map((match) => {
          const showScore = match.homeScore != null || match.awayScore != null;
          const winner = getMatchWinner(match);
          const homeName = hi(match.homeTeam?.id) ? "font-bold text-blue-400" : winner === "home" ? "font-bold text-white" : winner === "away" ? "text-slate-500" : "text-slate-200";
          const awayName = hi(match.awayTeam?.id) ? "font-bold text-blue-400" : winner === "away" ? "font-bold text-white" : winner === "home" ? "text-slate-500" : "text-slate-400";
          const homeScoreCls = `font-bold font-mono text-sm ${winner === "away" ? "text-slate-500" : "text-white"}`;
          const awayScoreCls = `font-bold font-mono text-sm ${winner === "home" ? "text-slate-500" : "text-white"}`;
          return (
            <div key={match.id} className="flex items-stretch select-none" {...(canManage ? getLongPressProps(match) : {})}>
              <div className="w-8 bg-slate-800/50 flex items-center justify-center shrink-0">
                <span className="text-[9px] font-bold text-slate-500" style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}>
                  {t("football.round_short", "G.")} {match.round || "-"}
                </span>
              </div>
              <div className="flex-1 py-3 px-3 flex items-center gap-2">
                <div className="flex-1 space-y-1.5 min-w-0">
                  <div className="text-sm truncate"><span className={homeName}>{match.homeTeam?.name || "?"}</span></div>
                  <div className="text-sm truncate"><span className={awayName}>{match.awayTeam?.name || "?"}</span></div>
                </div>
                {showScore
                  ? <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <span className={homeScoreCls}>{match.homeScore ?? "—"}</span>
                      <span className={awayScoreCls}>{match.awayScore ?? "—"}</span>
                    </div>
                  : <MatchStatusBadge status={match.status} />}
              </div>
            </div>
          );
        })}
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
