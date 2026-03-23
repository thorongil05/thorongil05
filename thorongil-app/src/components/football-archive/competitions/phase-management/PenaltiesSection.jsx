import { useState } from "react";
import PropTypes from "prop-types";

const inp = "bg-slate-700 border border-slate-600 text-white text-sm rounded-lg px-2 py-1 focus:outline-none focus:border-blue-500";

function PenaltyRow({ penalty, onRemove }) {
  return (
    <div className="flex items-center gap-2 bg-slate-700 border border-slate-600 rounded-lg px-3 py-1.5 text-sm text-slate-200">
      <span className="flex-1">{penalty.teamName}</span>
      <span className="text-red-400 font-bold shrink-0">-{penalty.points} pt</span>
      {penalty.reason && <span className="text-slate-500 text-xs truncate max-w-[80px]">{penalty.reason}</span>}
      <button onClick={onRemove} className="text-slate-500 hover:text-red-400 transition-colors text-xs font-bold">✕</button>
    </div>
  );
}
PenaltyRow.propTypes = { penalty: PropTypes.object.isRequired, onRemove: PropTypes.func.isRequired };

function AddPenaltyRow({ teams, onAdd }) {
  const [form, setForm] = useState({ teamId: "", points: 1, reason: "" });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleAdd = () => {
    if (!form.teamId || !form.points) return;
    const team = teams.find((t) => t.id === Number(form.teamId));
    onAdd({ teamId: Number(form.teamId), teamName: team?.name ?? "", points: Number(form.points), reason: form.reason || null });
    setForm({ teamId: "", points: 1, reason: "" });
  };

  return (
    <div className="flex flex-wrap gap-1.5 items-end pt-1">
      <select value={form.teamId} onChange={(e) => set("teamId", e.target.value)} className={`${inp} flex-1 min-w-[120px]`}>
        <option value="">Squadra</option>
        {teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
      </select>
      <input type="number" min="1" value={form.points} onChange={(e) => set("points", e.target.value)} className={`${inp} w-14`} placeholder="Pt" />
      <input value={form.reason} onChange={(e) => set("reason", e.target.value)} className={`${inp} flex-1 min-w-[80px]`} placeholder="Motivazione" />
      <button onClick={handleAdd} disabled={!form.teamId || !form.points} className="text-xs bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white px-2.5 py-1 rounded-lg transition-colors">
        + Aggiungi
      </button>
    </div>
  );
}
AddPenaltyRow.propTypes = { teams: PropTypes.array.isRequired, onAdd: PropTypes.func.isRequired };

export default function PenaltiesEditor({ value, onChange, teams }) {
  const penalties = value ?? [];

  const handleAdd = (p) => onChange([...penalties, p]);
  const handleRemove = (idx) => onChange(penalties.filter((_, i) => i !== idx));

  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Penalità</p>
      <div className="space-y-1 min-h-[2rem]">
        {penalties.length === 0 && <p className="text-xs text-slate-600 italic py-1">Nessuna penalità configurata</p>}
        {penalties.map((p, i) => (
          <PenaltyRow key={i} penalty={p} onRemove={() => handleRemove(i)} />
        ))}
      </div>
      <AddPenaltyRow teams={teams} onAdd={handleAdd} />
    </div>
  );
}

PenaltiesEditor.propTypes = {
  value: PropTypes.array,
  onChange: PropTypes.func.isRequired,
  teams: PropTypes.array.isRequired,
};
