import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { UserRoles } from "../../../constants/roles";
import { useAuth } from "../../../context/AuthContext";
import PropTypes from "prop-types";
import { MatchStatusBadge } from "../components/MatchStatusBadge";
import { useMatchContextMenu } from "../hooks/useMatchContextMenu";
import MatchContextMenu from "../MatchContextMenu";
import { getMatchWinner, groupMatchesByDate } from "../constants/matchResult";

const base10 = "text-[10px] font-bold text-slate-400 uppercase tracking-widest";
const thCls = `px-4 py-3 text-left ${base10}`;
const thNarrowCls = `w-px px-2 py-3 text-left ${base10}`;
const thRightCls = `pl-4 pr-2 py-3 text-right ${base10}`;
const thScoreCls = `px-2 py-3 text-center ${base10}`;
const thAwayCls = `pr-4 pl-2 py-3 text-left ${base10}`;
const tdScoreCls = "px-2 py-3 text-sm text-center";
const showOnlyBadge = (status) =>
  status && status !== "COMPLETED" && status !== "IN_PROGRESS" && status !== "FORFEITED";
const tdHomeCls = "pl-4 pr-2 py-3 text-sm text-right";
const tdAwayCls = "pr-4 pl-2 py-3 text-sm";

function SortTh({ label, col, sortBy, sortOrder, onSort, className }) {
  const icon = sortBy !== col ? "↕" : sortOrder === "asc" ? "↑" : "↓";
  const iconCls = sortBy !== col ? "text-slate-700 ml-1" : "text-blue-400 ml-1";
  return (
    <th className={`${className ?? thCls} cursor-pointer select-none`} onClick={() => onSort(col)}>
      {label}<span className={iconCls}>{icon}</span>
    </th>
  );
}

SortTh.propTypes = { label: PropTypes.string, col: PropTypes.string, sortBy: PropTypes.string, sortOrder: PropTypes.string, onSort: PropTypes.func, className: PropTypes.string };

export default function DesktopMatchesView({ matches, loading, error, sortBy, sortOrder, handleRequestSort, handleEditMatch, handleDeleteMatch, selectedTeamId }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const canManage = user?.role === UserRoles.ADMIN || user?.role === UserRoles.EDITOR;
  const hi = (id) => id === Number(selectedTeamId);
  const homeCls = (id, isWinner) => `${tdHomeCls} ${hi(id) ? "font-bold text-blue-400" : isWinner ? "font-bold text-slate-200" : "text-slate-200"}`;
  const awayCls = (id, isWinner) => `${tdAwayCls} ${hi(id) ? "font-bold text-blue-400" : isWinner ? "font-bold text-slate-200" : "text-slate-200"}`;
  const { menu, closeMenu, onContextMenu } = useMatchContextMenu();

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-left whitespace-nowrap">
          <thead>
            <tr className="bg-slate-800/50">
              <SortTh label={t("football.round", "G.")} col="round" sortBy={sortBy} sortOrder={sortOrder} onSort={handleRequestSort} className={thNarrowCls} />
              <th className={thRightCls}>{t("football.home_team", "Casa")}</th>
              <th className={thScoreCls}>{t("football.score", "Ris.")}</th>
              <th className={thAwayCls}>{t("football.away_team", "Ospite")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {loading && <tr><td colSpan={4} className="px-4 py-8 text-center text-slate-500 text-sm">Caricamento...</td></tr>}
            {error && !loading && <tr><td colSpan={4} className="px-4 py-8 text-center text-red-400 text-sm">Errore: {error}</td></tr>}
            {!loading && !error && matches.length === 0 && <tr><td colSpan={4} className="px-4 py-8 text-center text-slate-500 text-sm">Nessuna partita trovata</td></tr>}
            {!loading && !error && groupMatchesByDate(matches).map(({ label, items }) => (
              <Fragment key={label ?? "no-date"}>
                <tr><td colSpan={4} className="px-4 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider bg-slate-800/60">{label ?? "Data non definita"}</td></tr>
                {items.map((match) => {
              const winner = getMatchWinner(match);
              const isLive = match.status === "IN_PROGRESS";
              return (
                <tr key={match.id} className={`hover:bg-blue-500/5 transition-colors ${canManage ? "cursor-context-menu" : ""}`}
                  onContextMenu={canManage ? (e) => onContextMenu(match, e) : undefined}>
                  <td className="w-px px-2 py-3 text-sm text-slate-500 font-mono whitespace-nowrap">{match.round || "-"}</td>
                  <td className={homeCls(match.homeTeam?.id, winner === "home")}>{match.homeTeam?.name || "?"}</td>
                  <td className={tdScoreCls}>
                    {showOnlyBadge(match.status)
                      ? <MatchStatusBadge status={match.status} />
                      : <span className="inline-flex items-center gap-1.5">
                          <span className="inline-flex items-center gap-1 font-bold font-mono bg-slate-800 rounded-lg px-3 py-0.5 text-sm">
                            <span className="text-white">{match.homeScore ?? "—"}</span>
                            <span className="text-slate-600">-</span>
                            <span className="text-white">{match.awayScore ?? "—"}</span>
                          </span>
                          <MatchStatusBadge status={match.status} />
                          {isLive && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />}
                        </span>
                    }
                  </td>
                  <td className={awayCls(match.awayTeam?.id, winner === "away")}>{match.awayTeam?.name || "?"}</td>
                </tr>
              );
                })}
              </Fragment>
            ))}
          </tbody>
        </table>
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

DesktopMatchesView.propTypes = {
  matches: PropTypes.array.isRequired, loading: PropTypes.bool.isRequired, error: PropTypes.string,
  sortBy: PropTypes.string.isRequired, sortOrder: PropTypes.string.isRequired,
  handleRequestSort: PropTypes.func.isRequired, handleEditMatch: PropTypes.func.isRequired,
  handleDeleteMatch: PropTypes.func.isRequired, selectedTeamId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
