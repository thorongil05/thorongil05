import { useState } from "react";
import PropTypes from "prop-types";
import { apiPost, apiDelete } from "../../../../utils/api";

const TYPE_STYLE = {
  GROUP:    "text-blue-400 bg-blue-500/10 border-blue-500/30",
  KNOCKOUT: "text-purple-400 bg-purple-500/10 border-purple-500/30",
};
const TYPE_LABEL = { GROUP: "Gironi", KNOCKOUT: "Eliminazione" };

const inp = "flex-1 bg-slate-700 border border-slate-600 text-white text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500";
const sel = "bg-slate-700 border border-slate-600 text-slate-200 text-sm rounded-lg px-2 py-1.5 focus:outline-none focus:border-blue-500";

function PhaseItem({ phase, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-2.5 rounded-xl border transition-all ${
        selected
          ? "bg-blue-500/10 border-blue-500/30 text-white"
          : "border-transparent hover:bg-slate-800 text-slate-300"
      }`}
    >
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold truncate flex-1">{phase.name}</span>
        <span className={`text-xs border px-2 py-0.5 rounded-full shrink-0 ${TYPE_STYLE[phase.type] ?? "text-slate-400 border-slate-600"}`}>
          {TYPE_LABEL[phase.type] ?? phase.type}
        </span>
      </div>
      {(phase.metadata?.participantsCount > 0 || phase.metadata?.totalMatches > 0) && (
        <div className="flex gap-3 mt-0.5 text-xs text-slate-500">
          {phase.metadata?.participantsCount > 0 && <span>{phase.metadata.participantsCount} part.</span>}
          {phase.metadata?.totalMatches > 0 && <span>{phase.metadata.totalMatches} partite</span>}
        </div>
      )}
    </button>
  );
}

PhaseItem.propTypes = {
  phase: PropTypes.object.isRequired,
  selected: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

function AddPhaseForm({ editionId, phasesCount, onAdded }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState("GROUP");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name) return;
    setSaving(true);
    try {
      await apiPost(`/api/competitions/editions/${editionId}/phases`, { name, type, orderIndex: phasesCount });
      setName(""); setType("GROUP"); setOpen(false);
      onAdded();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full text-sm text-center text-blue-400 hover:text-blue-300 py-2 border border-dashed border-slate-700 hover:border-blue-500/50 rounded-xl transition-colors"
      >
        + Aggiungi fase
      </button>
    );
  }

  return (
    <div className="bg-slate-800/60 rounded-xl border border-blue-500/40 p-3 space-y-2">
      <div className="flex gap-2">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome fase" autoFocus className={inp} />
        <select value={type} onChange={(e) => setType(e.target.value)} className={sel}>
          <option value="GROUP">Gironi</option>
          <option value="KNOCKOUT">Eliminazione</option>
        </select>
      </div>
      <div className="flex gap-2">
        <button onClick={handleSave} disabled={saving || !name} className="text-sm bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-3 py-1 rounded-lg transition-colors">
          {saving ? "..." : "Salva"}
        </button>
        <button onClick={() => setOpen(false)} className="text-sm text-slate-400 hover:text-white border border-slate-700 px-3 py-1 rounded-lg transition-colors">
          Annulla
        </button>
      </div>
    </div>
  );
}

AddPhaseForm.propTypes = {
  editionId: PropTypes.number.isRequired,
  phasesCount: PropTypes.number.isRequired,
  onAdded: PropTypes.func.isRequired,
};

export default function PhaseSidebar({ editionId, phases, selectedId, onSelect, onUpdate }) {
  const handleDelete = async (phase) => {
    if (!window.confirm(`Eliminare la fase "${phase.name}"?`)) return;
    try {
      await apiDelete(`/api/competitions/phases/${phase.id}`);
      onUpdate();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-3 py-2 border-b border-slate-800 shrink-0">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Fasi ({phases.length})
        </p>
      </div>
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5">
        {phases.length === 0 && (
          <p className="text-sm text-slate-500 text-center py-6">Nessuna fase configurata.</p>
        )}
        {phases.map((phase) => (
          <div key={phase.id} className="group flex items-center gap-1">
            <div className="flex-1 min-w-0">
              <PhaseItem phase={phase} selected={selectedId === phase.id} onClick={() => onSelect(phase)} />
            </div>
            <button
              onClick={() => handleDelete(phase)}
              className="shrink-0 text-slate-700 hover:text-red-400 px-1.5 py-1 opacity-0 group-hover:opacity-100 transition-all"
              title="Elimina fase"
            >
              🗑️
            </button>
          </div>
        ))}
      </div>
      <div className="px-3 py-3 border-t border-slate-800 shrink-0">
        <AddPhaseForm editionId={editionId} phasesCount={phases.length} onAdded={onUpdate} />
      </div>
    </div>
  );
}

PhaseSidebar.propTypes = {
  editionId: PropTypes.number.isRequired,
  phases: PropTypes.array.isRequired,
  selectedId: PropTypes.number,
  onSelect: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
};
