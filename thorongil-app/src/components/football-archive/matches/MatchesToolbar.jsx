import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { UserRoles } from "../../../constants/roles";
import PropTypes from "prop-types";

const selectCls = "bg-slate-800 text-slate-200 text-sm rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer";
const isFiltered = (round, teamId, sortBy) => round !== "All" || teamId !== "All" || sortBy !== "match_date";

function RoundTabs({ rounds, selectedRound, onSelect }) {
  const containerRef = useRef();
  useEffect(() => {
    if (!containerRef.current) return;
    const sel = containerRef.current.querySelector("[data-selected='true']");
    if (!sel) return;
    const c = containerRef.current;
    c.scrollLeft = sel.offsetLeft - c.offsetWidth / 2 + sel.offsetWidth / 2;
  }, [selectedRound]);
  return (
    <div ref={containerRef} className="flex overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden gap-1.5 px-4 pb-3">
      {rounds.map((round) => (
        <button key={round} data-selected={round === selectedRound} onClick={() => onSelect(round)}
          className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold transition-colors ${round === selectedRound ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-400 hover:text-slate-200"}`}>
          {round}
        </button>
      ))}
    </div>
  );
}

export default function MatchesToolbar({ loading, matchesCount, selectedRound, setSelectedRound, rounds, selectedEdition, user, setBuilderOpen, selectedTeamId, setSelectedTeamId, teams, sortBy, handleResetFilters }) {
  const { t } = useTranslation();
  const canManage = user?.role === UserRoles.ADMIN || user?.role === UserRoles.EDITOR;
  return (
    <div className="border-b border-slate-800">
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white">{t("football.matches", "Partite")}</h2>
            {!loading && <span className="text-xs font-bold text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">{matchesCount}</span>}
          </div>
          {canManage && (
            <button onClick={() => setBuilderOpen(true)} disabled={!selectedEdition} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-sm rounded-xl transition-all font-semibold">
              + Giornata
            </button>
          )}
        </div>
        <div className="flex gap-2 flex-wrap">
          <select value={selectedRound || "All"} onChange={(e) => setSelectedRound(e.target.value)} disabled={!selectedEdition} className={`${selectCls} hidden sm:block`}>
            <option value="All">{t("football.all_rounds", "Tutte le giornate")}</option>
            {rounds?.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
          <select value={selectedTeamId || "All"} onChange={(e) => setSelectedTeamId(e.target.value)} disabled={!selectedEdition} className={selectCls}>
            <option value="All">{t("football.all_teams", "Tutte le squadre")}</option>
            {teams?.map((team) => <option key={team.id} value={team.id}>{team.name}</option>)}
          </select>
          {isFiltered(selectedRound, selectedTeamId, sortBy) && (
            <button onClick={handleResetFilters} className="hidden sm:flex px-3 py-2 rounded-lg text-sm text-slate-400 border border-slate-700 hover:border-slate-500 hover:text-white transition-all">↺ Reset</button>
          )}
          {selectedTeamId !== "All" && (
            <button onClick={handleResetFilters} className="sm:hidden px-3 py-2 rounded-lg text-sm text-slate-400 border border-slate-700 hover:border-slate-500 hover:text-white transition-all">↺ Reset</button>
          )}
        </div>
      </div>
      {selectedTeamId === "All" && rounds?.length > 0 && (
        <div className="sm:hidden">
          <RoundTabs rounds={rounds} selectedRound={selectedRound} onSelect={setSelectedRound} />
        </div>
      )}
    </div>
  );
}

MatchesToolbar.propTypes = {
  loading: PropTypes.bool, matchesCount: PropTypes.number,
  selectedRound: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  setSelectedRound: PropTypes.func, rounds: PropTypes.array,
  selectedEdition: PropTypes.object, user: PropTypes.object, setBuilderOpen: PropTypes.func,
  selectedTeamId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  setSelectedTeamId: PropTypes.func, teams: PropTypes.array,
  sortBy: PropTypes.string, handleResetFilters: PropTypes.func,
};
RoundTabs.propTypes = { rounds: PropTypes.array.isRequired, selectedRound: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), onSelect: PropTypes.func.isRequired };
