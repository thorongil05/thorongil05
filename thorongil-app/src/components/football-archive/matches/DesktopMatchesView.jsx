import { useTranslation } from "react-i18next";
import { UserRoles } from "../../../constants/roles";
import { useAuth } from "../../../context/AuthContext";
import PropTypes from "prop-types";

const thCls = "px-4 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest";
const thCenterCls = "px-4 py-3 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest";
const tdCls = "px-4 py-3 text-sm";
const tdCenterCls = "px-4 py-3 text-sm text-center";

function SortTh({ label, col, sortBy, sortOrder, onSort }) {
  const icon = sortBy !== col ? "↕" : sortOrder === "asc" ? "↑" : "↓";
  const iconCls = sortBy !== col ? "text-slate-700 ml-1" : "text-blue-400 ml-1";
  return (
    <th className={`${thCls} cursor-pointer select-none`} onClick={() => onSort(col)}>
      {label}<span className={iconCls}>{icon}</span>
    </th>
  );
}

SortTh.propTypes = { label: PropTypes.string, col: PropTypes.string, sortBy: PropTypes.string, sortOrder: PropTypes.string, onSort: PropTypes.func };

export default function DesktopMatchesView({ matches, loading, error, sortBy, sortOrder, handleRequestSort, handleEditMatch, handleDeleteMatch, selectedTeamId }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const canManage = user?.role === UserRoles.ADMIN || user?.role === UserRoles.EDITOR;
  const hi = (id) => id === Number(selectedTeamId);
  const teamCls = (id) => `${tdCls} ${hi(id) ? "font-bold text-blue-400" : "text-slate-200"}`;
  const cols = canManage ? 5 : 4;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left whitespace-nowrap">
        <thead>
          <tr className="bg-slate-800/50">
            <SortTh label={t("football.round", "G.")} col="round" sortBy={sortBy} sortOrder={sortOrder} onSort={handleRequestSort} />
            <th className={thCls}>{t("football.home_team", "Casa")}</th>
            <th className={thCenterCls}>{t("football.score", "Ris.")}</th>
            <th className={thCls}>{t("football.away_team", "Ospite")}</th>
            {canManage && <th className={thCls} />}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {loading && <tr><td colSpan={cols} className="px-4 py-8 text-center text-slate-500 text-sm">Caricamento...</td></tr>}
          {error && !loading && <tr><td colSpan={cols} className="px-4 py-8 text-center text-red-400 text-sm">Errore: {error}</td></tr>}
          {!loading && !error && matches.length === 0 && <tr><td colSpan={cols} className="px-4 py-8 text-center text-slate-500 text-sm">Nessuna partita trovata</td></tr>}
          {!loading && !error && matches.map((match) => (
            <tr key={match.id} className="hover:bg-blue-500/5 transition-colors group">
              <td className={`${tdCls} text-slate-500 font-mono`}>{match.round || "-"}</td>
              <td className={teamCls(match.homeTeam?.id)}>{match.homeTeam?.name || "?"}</td>
              <td className={tdCenterCls}>
                <span className="inline-block font-bold font-mono bg-slate-800 rounded-lg px-3 py-0.5 text-white text-sm">
                  {match.homeScore} - {match.awayScore}
                </span>
              </td>
              <td className={teamCls(match.awayTeam?.id)}>{match.awayTeam?.name || "?"}</td>
              {canManage && (
                <td className="px-4 py-3 text-right">
                  <div className="flex gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEditMatch(match)} className="text-slate-500 hover:text-blue-400 transition-colors text-xs p-1">✎</button>
                    <button onClick={() => handleDeleteMatch(match.id)} className="text-slate-500 hover:text-red-400 transition-colors text-xs p-1">✕</button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

DesktopMatchesView.propTypes = {
  matches: PropTypes.array.isRequired, loading: PropTypes.bool.isRequired, error: PropTypes.string,
  sortBy: PropTypes.string.isRequired, sortOrder: PropTypes.string.isRequired,
  handleRequestSort: PropTypes.func.isRequired, handleEditMatch: PropTypes.func.isRequired,
  handleDeleteMatch: PropTypes.func.isRequired, selectedTeamId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
