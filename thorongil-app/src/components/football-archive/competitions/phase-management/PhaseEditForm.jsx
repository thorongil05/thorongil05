import { useState } from "react";
import PropTypes from "prop-types";
import { apiPut } from "../../../../utils/api";

const inp = "w-full bg-slate-700 border border-slate-600 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500";
const lbl = "block text-xs text-slate-400 mb-1";

export default function PhaseEditForm({ phase, onSaved, onCancel }) {
  const [form, setForm] = useState({
    name: phase.name ?? "",
    type: phase.type ?? "GROUP",
    metadata: {
      participantsCount: phase.metadata?.participantsCount ?? "",
      totalMatches: phase.metadata?.totalMatches ?? "",
      matchesPerRound: phase.metadata?.matchesPerRound ?? "",
    },
  });
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const setMeta = (k, v) => setForm((f) => ({ ...f, metadata: { ...f.metadata, [k]: v } }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await apiPut(`/api/competitions/phases/${phase.id}`, form);
      onSaved();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className={lbl}>Nome</label>
          <input value={form.name} onChange={(e) => set("name", e.target.value)} className={inp} />
        </div>
        <div>
          <label className={lbl}>Tipo</label>
          <select value={form.type} onChange={(e) => set("type", e.target.value)} className={inp}>
            <option value="GROUP">Gironi</option>
            <option value="KNOCKOUT">Eliminazione</option>
          </select>
        </div>
        <div>
          <label className={lbl}>Partecipanti</label>
          <input type="number" value={form.metadata.participantsCount} onChange={(e) => setMeta("participantsCount", e.target.value)} className={inp} />
        </div>
        <div>
          <label className={lbl}>Partite Totali</label>
          <input type="number" value={form.metadata.totalMatches} onChange={(e) => setMeta("totalMatches", e.target.value)} className={inp} />
        </div>
      </div>
      <div className="flex gap-2 pt-1">
        <button onClick={handleSave} disabled={saving} className="text-sm bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-4 py-1.5 rounded-lg transition-colors">
          {saving ? "Salvataggio..." : "Salva"}
        </button>
        <button onClick={onCancel} className="text-sm text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 px-4 py-1.5 rounded-lg transition-colors">
          Annulla
        </button>
      </div>
    </div>
  );
}

PhaseEditForm.propTypes = {
  phase: PropTypes.object.isRequired,
  onSaved: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};
