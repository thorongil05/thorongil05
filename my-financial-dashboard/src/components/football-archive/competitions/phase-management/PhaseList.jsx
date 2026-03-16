import { useState } from "react";
import PropTypes from "prop-types";
import { apiPost } from "../../../../utils/api";
import PhaseRow from "./PhaseRow";

const selCls = "bg-slate-700 border border-slate-600 text-slate-200 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500";
const inpCls = "flex-1 bg-slate-700 border border-slate-600 text-white text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500";

export default function PhaseList({ editionId, phases, onUpdate }) {
  const [adding, setAdding] = useState(false);
  const [newPhase, setNewPhase] = useState({ name: "", type: "GROUP" });
  const [saving, setSaving] = useState(false);

  const handleAdd = async () => {
    if (!newPhase.name) return;
    setSaving(true);
    try {
      await apiPost(`/api/competitions/editions/${editionId}/phases`, { ...newPhase, orderIndex: phases.length });
      setNewPhase({ name: "", type: "GROUP" });
      setAdding(false);
      onUpdate();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Fasi ({phases.length})</p>
        {!adding && (
          <button onClick={() => setAdding(true)} className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-2.5 py-1 rounded-lg transition-colors">
            + Aggiungi Fase
          </button>
        )}
      </div>

      {adding && (
        <div className="bg-slate-800/50 rounded-xl border border-blue-500/40 p-3 mb-3">
          <div className="flex gap-2 mb-2">
            <input value={newPhase.name} onChange={(e) => setNewPhase((p) => ({ ...p, name: e.target.value }))}
              placeholder="Nome fase" autoFocus className={inpCls} />
            <select value={newPhase.type} onChange={(e) => setNewPhase((p) => ({ ...p, type: e.target.value }))} className={selCls}>
              <option value="GROUP">Gironi</option>
              <option value="KNOCKOUT">Eliminazione</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button onClick={handleAdd} disabled={saving || !newPhase.name} className="text-sm bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-3 py-1 rounded-lg transition-colors">
              {saving ? "..." : "Salva"}
            </button>
            <button onClick={() => setAdding(false)} className="text-sm text-slate-400 hover:text-white border border-slate-700 px-3 py-1 rounded-lg transition-colors">
              Annulla
            </button>
          </div>
        </div>
      )}

      {phases.length === 0 && !adding && (
        <p className="text-sm text-slate-500 text-center py-4">Nessuna fase configurata.</p>
      )}

      {phases.map((phase, idx) => (
        <PhaseRow key={phase.id} phase={phase} onUpdate={onUpdate} defaultExpanded={idx === phases.length - 1} />
      ))}
    </div>
  );
}

PhaseList.propTypes = {
  editionId: PropTypes.number.isRequired,
  phases: PropTypes.array.isRequired,
  onUpdate: PropTypes.func.isRequired,
};
