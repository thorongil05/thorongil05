import { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { useAuth } from "../../../../context/AuthContext";
import { UserRoles } from "../../../../constants/roles";
import { apiGet, apiPut } from "../../../../utils/api";

const inp = "bg-slate-700 border border-slate-600 text-white text-sm rounded-lg px-2 py-1 focus:outline-none focus:border-blue-500";

function AddPenaltyForm({ teams, onAdd }) {
  const [form, setForm] = useState({ teamId: "", points: 1, reason: "" });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleAdd = () => {
    if (!form.teamId || !form.points) return;
    onAdd({ teamId: Number(form.teamId), points: Number(form.points), reason: form.reason || null });
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
      <button onClick={handleAdd} disabled={!form.teamId || !form.points} className="text-xs bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white px-2.5 py-1 rounded-lg transition-colors">+ Aggiungi</button>
    </div>
  );
}
AddPenaltyForm.propTypes = { teams: PropTypes.array.isRequired, onAdd: PropTypes.func.isRequired };

export default function PenaltiesSection({ group, editionId, onGroupUpdated }) {
  const { user } = useAuth();
  const canManage = user?.role === UserRoles.ADMIN || user?.role === UserRoles.EDITOR;
  const [teams, setTeams] = useState([]);
  const [open, setOpen] = useState(false);

  const penalties = group.metadata?.penalties ?? [];

  const fetchTeams = useCallback(() => {
    if (teams.length > 0) return;
    apiGet(`/api/competitions/editions/${editionId}/teams`)
      .then((r) => setTeams(r.data || r))
      .catch(() => {});
  }, [editionId, teams.length]);

  useEffect(() => { if (open && canManage) fetchTeams(); }, [open, canManage, fetchTeams]);

  const savePenalties = async (updated) => {
    const metadata = { ...(group.metadata || {}), penalties: updated };
    await apiPut(`/api/competitions/groups/${group.id}`, { name: group.name, metadata }).catch(console.error);
    onGroupUpdated();
  };

  const handleAdd = (penalty) => {
    const team = teams.find((t) => t.id === penalty.teamId);
    savePenalties([...penalties, { ...penalty, teamName: team?.name ?? "" }]);
  };

  const handleDelete = (idx) => savePenalties(penalties.filter((_, i) => i !== idx));

  if (!canManage && penalties.length === 0) return null;

  return (
    <div className="mt-2 pt-2 border-t border-slate-700/50">
      <button onClick={() => setOpen((o) => !o)} className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors">
        <span>{open ? "▾" : "▸"}</span>
        <span>Penalità</span>
        {penalties.length > 0 && <span className="text-red-400 font-semibold">({penalties.length})</span>}
      </button>
      {open && (
        <div className="mt-2 space-y-1">
          {penalties.length === 0 && <p className="text-xs text-slate-600">Nessuna penalità.</p>}
          {penalties.map((p, i) => (
            <div key={i} className="flex items-center gap-2 text-xs">
              <span className="flex-1 text-slate-300 font-medium truncate">{p.teamName}</span>
              <span className="text-red-400 font-bold shrink-0">-{p.points} pt</span>
              {p.reason && <span className="text-slate-500 truncate max-w-[100px]">{p.reason}</span>}
              {canManage && <button onClick={() => handleDelete(i)} className="text-slate-600 hover:text-red-400 transition-colors shrink-0">✕</button>}
            </div>
          ))}
          {canManage && <AddPenaltyForm teams={teams} onAdd={handleAdd} />}
        </div>
      )}
    </div>
  );
}

PenaltiesSection.propTypes = {
  group: PropTypes.object.isRequired,
  editionId: PropTypes.number.isRequired,
  onGroupUpdated: PropTypes.func.isRequired,
};
