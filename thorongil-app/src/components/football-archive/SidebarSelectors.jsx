import { useNavigate } from "react-router";
import PropTypes from "prop-types";
import CompetitionProgress from "./competitions/CompetitionProgress";

const selectCls = "w-full bg-slate-800 text-slate-200 text-sm rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer";
const labelCls = "text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2";
const btnActiveCls = "bg-blue-500/20 text-blue-400 border border-blue-500/30 font-semibold";
const btnIdleCls = "text-slate-400 hover:bg-slate-800 hover:text-white";

function SelectRow({ label, options, value, onChange }) {
  if (!options || options.length === 0) return null;
  return (
    <section className="mt-4">
      <p className={labelCls}>{label}</p>
      {options.length === 1 ? (
        <p className="text-sm text-slate-300 px-1">{options[0].name}</p>
      ) : (
        <select value={value || ""} onChange={onChange} className={selectCls}>
          {options.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
        </select>
      )}
    </section>
  );
}

SelectRow.propTypes = { label: PropTypes.string.isRequired, options: PropTypes.array, value: PropTypes.number, onChange: PropTypes.func.isRequired };

export default function SidebarSelectors({ data, canManage, onAddCompetition, showCompetitions = true }) {
  const navigate = useNavigate();
  const btnCls = (active) => `flex-1 text-left px-3 py-2 rounded-lg text-sm mb-1 transition-all ${active ? btnActiveCls : btnIdleCls}`;

  return (
    <div className="flex-1">
      {showCompetitions && (
        <>
          <p className={labelCls}>Campionato</p>
          <div className="space-y-0.5 mb-1">
            {data.competitions.map((comp) => {
              const isSelected = data.selectedCompetition?.id === comp.id;
              return (
                <div key={comp.id} className="flex items-center gap-1">
                  <button onClick={() => data.setSelectedCompetition(comp)} className={btnCls(isSelected)}>{comp.name}</button>
                  {canManage && isSelected && (
                    <button onClick={() => navigate(`/football-archive/competition/edit/${comp.id}`)} className="shrink-0 text-slate-600 hover:text-slate-300 p-1 rounded transition-colors mb-1" title="Gestisci">⚙️</button>
                  )}
                </div>
              );
            })}
            {canManage && onAddCompetition && (
              <button onClick={onAddCompetition} className="w-full text-left px-3 py-1.5 text-xs text-slate-600 hover:text-slate-400 transition-colors">
                + Aggiungi campionato
              </button>
            )}
          </div>
        </>
      )}
      <SelectRow label="Stagione" options={data.editions} value={data.selectedEdition?.id}
        onChange={(e) => data.setSelectedEdition(data.editions.find((x) => x.id === Number(e.target.value)))} />
      <CompetitionProgress
        edition={data.selectedEdition}
        group={data.groups?.find((g) => g.id === data.selectedGroupId) ?? null}
        refreshTrigger={data.refreshTrigger}
      />
      <SelectRow label="Fase" options={data.phases} value={data.selectedPhaseId}
        onChange={(e) => data.handlePhaseChange(Number(e.target.value))} />
      <SelectRow label="Girone" options={data.groups} value={data.selectedGroupId}
        onChange={(e) => data.setSelectedGroupId(Number(e.target.value))} />
    </div>
  );
}

SidebarSelectors.propTypes = {
  data: PropTypes.object.isRequired,
  canManage: PropTypes.bool,
  onAddCompetition: PropTypes.func,
  showCompetitions: PropTypes.bool,
};
