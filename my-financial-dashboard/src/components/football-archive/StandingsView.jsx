import { useState } from "react";
import PropTypes from "prop-types";
import { Slider } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useStandingsData } from "./hooks/useStandingsData";

function SortTh({ label, col, sortBy, sortOrder, onSort, center }) {
  const icon = sortBy !== col ? "↕" : sortOrder === "asc" ? "↑" : "↓";
  return <th className={`px-3 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest cursor-pointer select-none${center ? " text-center" : ""}`} onClick={() => onSort(col)}>{label}<span className={sortBy === col ? "text-blue-400 ml-1" : "text-slate-700 ml-1"}>{icon}</span></th>;
}
SortTh.propTypes = { label: PropTypes.string, col: PropTypes.string, sortBy: PropTypes.string, sortOrder: PropTypes.string, onSort: PropTypes.func, center: PropTypes.bool };

export default function StandingsView({ selectedEdition, selectedPhaseId, selectedGroupId, refreshTrigger }) {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const { sortedStandings, loading, error, sliderValue, handleSliderChange, handleIntervalChange, maxRound, sortBy, sortOrder, handleSort, resetSorting } = useStandingsData({ selectedEdition, selectedPhaseId, selectedGroupId, refreshTrigger });
  const cols = isExpanded ? 10 : 4;
  const st = { sortBy, sortOrder, onSort: handleSort };

  return (
    <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-slate-800">
        <h2 className="text-lg font-bold text-white">{t("football.standings", "Classifica")}</h2>
        <div className="flex items-center gap-2">
          {(sortBy !== "points" || sortOrder !== "desc") && <button onClick={resetSorting} className="px-2 py-1 text-xs text-slate-400 border border-slate-700 rounded-lg hover:border-slate-500 hover:text-white transition-all">↺</button>}
          <button onClick={() => setIsExpanded(!isExpanded)} className="px-3 py-1.5 text-xs text-slate-400 border border-slate-700 rounded-lg hover:border-blue-500 hover:text-blue-400 transition-all">
            {isExpanded ? "▲ Meno" : "▼ Più"}
          </button>
        </div>
      </div>

      {maxRound > 1 && (
        <div className="px-6 py-3 border-b border-slate-800">
          <Slider value={sliderValue} onChange={handleSliderChange} onChangeCommitted={handleIntervalChange} valueLabelDisplay="auto" min={1} max={maxRound} size="small" sx={{ color: "#3b82f6" }} />
          <p className="text-[10px] text-slate-500 text-center mt-1">{t("football.rounds_range", "Giornate")}: {sliderValue[0]} – {sliderValue[1]}</p>
        </div>
      )}

      <div className="flex-1 min-h-0 overflow-auto">
        <table className="w-full text-left whitespace-nowrap">
          <thead>
            <tr className="bg-slate-800/50">
              <th className="px-3 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest w-10">#</th>
              <SortTh label="Team" col="teamName" {...st} />
              <SortTh label="P" col="played" {...st} center />
              {isExpanded && <><SortTh label="V" col="won" {...st} center /><SortTh label="N" col="drawn" {...st} center /><SortTh label="S" col="lost" {...st} center /><SortTh label="GF" col="goalsFor" {...st} center /><SortTh label="GS" col="goalsAgainst" {...st} center /><SortTh label="DR" col="goalDifference" {...st} center /></>}
              <SortTh label="Pts" col="points" {...st} center />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {loading && <tr><td colSpan={cols} className="px-4 py-8 text-center text-slate-500 text-sm">Caricamento...</td></tr>}
            {error && !loading && <tr><td colSpan={cols} className="px-4 py-8 text-center text-red-400 text-sm">Errore: {error}</td></tr>}
            {!loading && !error && sortedStandings.length === 0 && <tr><td colSpan={cols} className="px-4 py-8 text-center text-slate-500 text-sm">Nessuna classifica disponibile</td></tr>}
            {!loading && !error && sortedStandings.map((team, idx) => (
              <tr key={team.teamId} className="hover:bg-blue-500/5 transition-colors">
                <td className="px-3 py-2.5 text-sm text-slate-500">{idx + 1}</td>
                <td className="px-3 py-2.5 text-sm text-slate-200 font-medium">{team.teamName}</td>
                <td className="px-3 py-2.5 text-sm text-slate-400 text-center">{team.played}</td>
                {isExpanded && <><td className="px-3 py-2.5 text-sm text-green-400 text-center">{team.won}</td><td className="px-3 py-2.5 text-sm text-yellow-400 text-center">{team.drawn}</td><td className="px-3 py-2.5 text-sm text-red-400 text-center">{team.lost}</td><td className="px-3 py-2.5 text-sm text-slate-400 text-center">{team.goalsFor}</td><td className="px-3 py-2.5 text-sm text-slate-400 text-center">{team.goalsAgainst}</td><td className="px-3 py-2.5 text-sm text-slate-400 text-center">{team.goalDifference}</td></>}
                <td className="px-3 py-2.5 text-sm text-center"><span className="font-bold text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-lg">{team.points}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

StandingsView.propTypes = {
  selectedEdition: PropTypes.shape({ id: PropTypes.number.isRequired, name: PropTypes.string }),
  selectedPhaseId: PropTypes.number,
  selectedGroupId: PropTypes.number,
  refreshTrigger: PropTypes.number,
};
