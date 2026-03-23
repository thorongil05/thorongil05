import { useState } from "react";
import PropTypes from "prop-types";
import { Slider } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useStandingsData } from "./hooks/useStandingsData";
import { useAuth } from "../../context/AuthContext";
import { UserRoles } from "../../constants/roles";

const TAG_ROW = {
  PROMOTED:  "border-l-2 border-l-green-500  bg-green-500/5",
  PLAYOFF:   "border-l-2 border-l-blue-400   bg-blue-400/5",
  PLAYOUT:   "border-l-2 border-l-orange-400 bg-orange-400/5",
  RELEGATED: "border-l-2 border-l-red-500    bg-red-500/5",
};
const TAG_LABEL = {
  PROMOTED:  "Promossa",
  PLAYOFF:   "Playoff",
  PLAYOUT:   "Playout",
  RELEGATED: "Retrocessa",
};

function rowTag(tags) { return tags?.[0] ?? null; }

function SortTh({ label, col, sortBy, sortOrder, onSort, center }) {
  const icon = sortBy !== col ? "↕" : sortOrder === "asc" ? "↑" : "↓";
  return <th className={`px-3 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest cursor-pointer select-none${center ? " text-center" : ""}`} onClick={() => onSort(col)}>{label}<span className={sortBy === col ? "text-blue-400 ml-1" : "text-slate-700 ml-1"}>{icon}</span></th>;
}
SortTh.propTypes = { label: PropTypes.string, col: PropTypes.string, sortBy: PropTypes.string, sortOrder: PropTypes.string, onSort: PropTypes.func, center: PropTypes.bool };

function NoCriteriaMessage({ canManage }) {
  if (canManage) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 gap-3 p-8 text-center">
        <span className="text-2xl">ℹ</span>
        <p className="text-sm text-slate-400 max-w-xs">
          Configura i criteri di ex-aequo nella gestione del girone per visualizzare la classifica.
        </p>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center flex-1 p-8">
      <p className="text-sm text-slate-500">Classifica non ancora disponibile.</p>
    </div>
  );
}
NoCriteriaMessage.propTypes = { canManage: PropTypes.bool };

function StandingsRow({ team, idx, isExpanded }) {
  const tag = rowTag(team.tags);
  return (
    <tr className={`transition-colors hover:brightness-110 ${TAG_ROW[tag] ?? "border-l-2 border-transparent hover:bg-blue-500/5"}`}>
      <td className="px-3 py-2.5 text-sm text-slate-500">
        <span className="flex items-center gap-1.5">
          {idx + 1}
        </span>
      </td>
      <td className="px-3 py-2.5 text-sm text-slate-200 font-medium">{team.teamName}</td>
      <td className="px-3 py-2.5 text-sm text-slate-400 text-center">{team.played}</td>
      {isExpanded && <ExpandedCells team={team} />}
      <td className="px-3 py-2.5 text-sm text-center"><span className="font-bold text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-lg">{team.points}</span></td>
    </tr>
  );
}
StandingsRow.propTypes = { team: PropTypes.object.isRequired, idx: PropTypes.number.isRequired, isExpanded: PropTypes.bool.isRequired };

function ExpandedCells({ team }) {
  return <><td className="px-3 py-2.5 text-sm text-green-400 text-center">{team.won}</td><td className="px-3 py-2.5 text-sm text-yellow-400 text-center">{team.drawn}</td><td className="px-3 py-2.5 text-sm text-red-400 text-center">{team.lost}</td><td className="px-3 py-2.5 text-sm text-slate-400 text-center">{team.goalsFor}</td><td className="px-3 py-2.5 text-sm text-slate-400 text-center">{team.goalsAgainst}</td><td className="px-3 py-2.5 text-sm text-slate-400 text-center">{team.goalDifference}</td></>;
}
ExpandedCells.propTypes = { team: PropTypes.object.isRequired };

function StandingsHeader({ t, sortBy, sortOrder, resetSorting, isExpanded, setIsExpanded }) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-slate-800">
      <h2 className="text-lg font-bold text-white">{t("football.standings", "Classifica")}</h2>
      <div className="flex items-center gap-2">
        {(sortBy !== "points" || sortOrder !== "desc") && <button onClick={resetSorting} className="px-2 py-1 text-xs text-slate-400 border border-slate-700 rounded-lg hover:border-slate-500 hover:text-white transition-all">↺</button>}
        <button onClick={() => setIsExpanded(!isExpanded)} className="px-3 py-1.5 text-xs text-slate-400 border border-slate-700 rounded-lg hover:border-blue-500 hover:text-blue-400 transition-all">
          {isExpanded ? "▲ Meno" : "▼ Più"}
        </button>
      </div>
    </div>
  );
}
StandingsHeader.propTypes = { t: PropTypes.func.isRequired, sortBy: PropTypes.string, sortOrder: PropTypes.string, resetSorting: PropTypes.func.isRequired, isExpanded: PropTypes.bool.isRequired, setIsExpanded: PropTypes.func.isRequired };

function ExpandedHeaders({ st }) {
  return <><SortTh label="V" col="won" {...st} center /><SortTh label="N" col="drawn" {...st} center /><SortTh label="S" col="lost" {...st} center /><SortTh label="GF" col="goalsFor" {...st} center /><SortTh label="GS" col="goalsAgainst" {...st} center /><SortTh label="DR" col="goalDifference" {...st} center /></>;
}
ExpandedHeaders.propTypes = { st: PropTypes.object.isRequired };

function StandingsBody({ loading, error, sortedStandings, cols, isExpanded }) {
  if (loading) return <tr><td colSpan={cols} className="px-4 py-8 text-center text-slate-500 text-sm">Caricamento...</td></tr>;
  if (error) return <tr><td colSpan={cols} className="px-4 py-8 text-center text-red-400 text-sm">Errore: {error}</td></tr>;
  if (!sortedStandings.length) return <tr><td colSpan={cols} className="px-4 py-8 text-center text-slate-500 text-sm">Nessuna classifica disponibile</td></tr>;
  return sortedStandings.map((team, idx) => <StandingsRow key={team.teamId} team={team} idx={idx} isExpanded={isExpanded} />);
}
StandingsBody.propTypes = { loading: PropTypes.bool, error: PropTypes.string, sortedStandings: PropTypes.array.isRequired, cols: PropTypes.number.isRequired, isExpanded: PropTypes.bool.isRequired };

export default function StandingsView({ selectedEdition, selectedPhaseId, selectedGroupId, selectedGroup, refreshTrigger }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const { sortedStandings, loading, error, sliderValue, handleSliderChange, handleIntervalChange, maxRound, sortBy, sortOrder, handleSort, resetSorting } = useStandingsData({ selectedEdition, selectedPhaseId, selectedGroupId, refreshTrigger });
  const cols = isExpanded ? 10 : 4;
  const st = { sortBy, sortOrder, onSort: handleSort };

  const isGroupPhase = selectedGroupId != null;
  const hasCriteria = (selectedGroup?.metadata?.tiebreakerCriteria?.length ?? 0) > 0;
  const canManage = user?.role === UserRoles.ADMIN || user?.role === UserRoles.EDITOR;

  if (isGroupPhase && !hasCriteria) {
    return (
      <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <h2 className="text-lg font-bold text-white">{t("football.standings", "Classifica")}</h2>
        </div>
        <NoCriteriaMessage canManage={canManage} />
      </div>
    );
  }

  return (
    <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 flex flex-col h-full">
      <StandingsHeader t={t} sortBy={sortBy} sortOrder={sortOrder} resetSorting={resetSorting} isExpanded={isExpanded} setIsExpanded={setIsExpanded} />

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
              {isExpanded && <ExpandedHeaders st={st} />}
              <SortTh label="Pts" col="points" {...st} center />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            <StandingsBody loading={loading} error={error} sortedStandings={sortedStandings} cols={cols} isExpanded={isExpanded} />
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
  selectedGroup: PropTypes.object,
  refreshTrigger: PropTypes.number,
};
