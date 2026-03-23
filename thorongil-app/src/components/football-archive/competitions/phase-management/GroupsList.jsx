import { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { apiGet, apiPost, apiPut, apiDelete } from "../../../../utils/api";
import TiebreakerEditor from "./TiebreakerEditor";
import { TIEBREAKER_CRITERIA_OPTIONS } from "../../constants/tiebreakerCriteria";
import PenaltiesSection from "./PenaltiesSection";

function CriteriaModal({ criteria, onClose }) {
  const labels = criteria.map((v) => TIEBREAKER_CRITERIA_OPTIONS.find((o) => o.value === v)?.label ?? v);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative bg-slate-800 border border-slate-700 rounded-2xl p-5 w-full max-w-xs shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-white">Criteri di ex-aequo</p>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors text-sm">✕</button>
        </div>
        <p className="text-xs text-slate-500 mb-3">Punti è sempre il primo criterio. Alfabetico è sempre l&apos;ultimo.</p>
        <ol className="space-y-1.5">
          {labels.map((label, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-slate-200">
              <span className="w-5 h-5 rounded-full bg-slate-700 text-slate-400 text-xs flex items-center justify-center shrink-0 font-mono">{i + 1}</span>
              {label}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
CriteriaModal.propTypes = { criteria: PropTypes.arrayOf(PropTypes.string).isRequired, onClose: PropTypes.func.isRequired };

function CriteriaBadge({ criteria, onClick }) {
  const count = criteria?.length ?? 0;
  if (count === 0) return <span className="text-xs text-slate-600 italic">Nessun criterio</span>;
  return (
    <button onClick={onClick} className="text-xs text-blue-400 hover:text-blue-300 border border-blue-500/30 hover:border-blue-400/50 bg-blue-500/10 px-2 py-0.5 rounded-full transition-colors">
      Criteri attivi {count}
    </button>
  );
}
CriteriaBadge.propTypes = { criteria: PropTypes.array, onClick: PropTypes.func.isRequired };

function GroupReadView({ g, onEdit, onDelete, onCriteriaClick, onGroupUpdated, editionId }) {
  return (
    <div className="flex items-start gap-2">
      <div className="flex-1 min-w-0">
        <span className="text-sm font-semibold text-slate-200">{g.name}</span>
        {Object.keys(g.metadata || {}).some((k) => g.metadata[k] > 0) && (
          <dl className="mt-2 flex flex-wrap gap-x-6 gap-y-2">
            {g.metadata?.participantsCount > 0 && <div><dt className="text-xs text-slate-500">Partecipanti</dt><dd className="text-sm text-slate-200 font-semibold">{g.metadata.participantsCount}</dd></div>}
            {g.metadata?.totalMatches > 0 && <div><dt className="text-xs text-slate-500">Partite totali</dt><dd className="text-sm text-slate-200 font-semibold">{g.metadata.totalMatches}</dd></div>}
            {g.metadata?.promotionsCount > 0 && <div><dt className="text-xs text-slate-500">Promozioni dirette</dt><dd className="text-sm text-green-400 font-semibold">{g.metadata.promotionsCount}</dd></div>}
            {g.metadata?.relegationsCount > 0 && <div><dt className="text-xs text-slate-500">Retrocessioni dirette</dt><dd className="text-sm text-red-400 font-semibold">{g.metadata.relegationsCount}</dd></div>}
            {g.metadata?.playoffSpotsCount > 0 && <div><dt className="text-xs text-slate-500">Posti playoff</dt><dd className="text-sm text-yellow-400 font-semibold">{g.metadata.playoffSpotsCount}</dd></div>}
            {g.metadata?.playoutSpotsCount > 0 && <div><dt className="text-xs text-slate-500">Posti playout</dt><dd className="text-sm text-orange-400 font-semibold">{g.metadata.playoutSpotsCount}</dd></div>}
          </dl>
        )}
        <div className="mt-2">
          <CriteriaBadge criteria={g.metadata?.tiebreakerCriteria} onClick={onCriteriaClick} />
        </div>
        <PenaltiesSection group={g} editionId={editionId} onGroupUpdated={onGroupUpdated} />
      </div>
      <button onClick={onEdit} className="text-xs text-slate-500 hover:text-slate-300 transition-colors shrink-0">✏️</button>
      <button onClick={onDelete} className="text-xs text-slate-600 hover:text-red-400 transition-colors shrink-0">🗑️</button>
    </div>
  );
}
GroupReadView.propTypes = { g: PropTypes.object.isRequired, onEdit: PropTypes.func.isRequired, onDelete: PropTypes.func.isRequired, onCriteriaClick: PropTypes.func.isRequired, onGroupUpdated: PropTypes.func.isRequired, editionId: PropTypes.number.isRequired };

const inp = "bg-slate-700 border border-slate-600 text-white text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500";
const numInp = `${inp} w-full`;
const lbl = "text-xs text-slate-400 mb-1 block";

function Field({ label, value, onChange }) {
  return (
    <div>
      <label className={lbl}>{label}</label>
      <input type="number" min="0" value={value ?? ""} onChange={(e) => onChange(e.target.value)} className={numInp} />
    </div>
  );
}

Field.propTypes = { label: PropTypes.string.isRequired, value: PropTypes.number, onChange: PropTypes.func.isRequired };

function GroupEditInline({ group, onChange, onSave, onCancel }) {
  const setMeta = (field, val) => {
    const parsed = val === "" ? undefined : parseInt(val);
    onChange({ ...group, metadata: { ...(group.metadata || {}), [field]: parsed } });
  };

  const handleTiebreakerChange = (criteria) => {
    onChange({ ...group, metadata: { ...(group.metadata || {}), tiebreakerCriteria: criteria } });
  };

  return (
    <div className="space-y-3 py-1">
      <div>
        <label className={lbl}>Nome girone</label>
        <input
          value={group.name}
          onChange={(e) => onChange({ ...group, name: e.target.value })}
          autoFocus
          placeholder="Es. Gruppo A"
          className={`w-full ${inp}`}
        />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        <Field label="Partecipanti" value={group.metadata?.participantsCount} onChange={(v) => setMeta("participantsCount", v)} />
        <Field label="Partite totali" value={group.metadata?.totalMatches} onChange={(v) => setMeta("totalMatches", v)} />
        <Field label="Promozioni dirette" value={group.metadata?.promotionsCount} onChange={(v) => setMeta("promotionsCount", v)} />
        <Field label="Retrocessioni dirette" value={group.metadata?.relegationsCount} onChange={(v) => setMeta("relegationsCount", v)} />
        <Field label="Posti playoff" value={group.metadata?.playoffSpotsCount} onChange={(v) => setMeta("playoffSpotsCount", v)} />
        <Field label="Posti playout" value={group.metadata?.playoutSpotsCount} onChange={(v) => setMeta("playoutSpotsCount", v)} />
      </div>
      <div className="border-t border-slate-700 pt-3">
        <TiebreakerEditor
          value={group.metadata?.tiebreakerCriteria ?? []}
          onChange={handleTiebreakerChange}
        />
      </div>
      <div className="flex justify-end gap-2 pt-1">
        <button onClick={onCancel} className="text-sm text-slate-400 border border-slate-600 hover:border-slate-500 px-4 py-1.5 rounded-lg transition-colors">Annulla</button>
        <button onClick={onSave} className="text-sm bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded-lg transition-colors">Salva</button>
      </div>
    </div>
  );
}

GroupEditInline.propTypes = {
  group: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default function GroupsList({ phase }) {
  const [groups, setGroups] = useState([]);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [editingGroup, setEditingGroup] = useState(null);
  const [criteriaModal, setCriteriaModal] = useState(null);

  const fetchGroups = useCallback(() => {
    if (phase.type !== "GROUP") return;
    apiGet(`/api/competitions/phases/${phase.id}/groups`).then(setGroups).catch(() => {});
  }, [phase.id, phase.type]);

  useEffect(() => { fetchGroups(); }, [fetchGroups]);

  if (phase.type !== "GROUP") {
    return <p className="text-sm text-slate-500">Fase di eliminazione diretta — nessun girone previsto.</p>;
  }

  const handleAdd = async () => {
    if (!newName) return;
    await apiPost(`/api/competitions/phases/${phase.id}/groups`, { name: newName }).catch(() => {});
    setNewName(""); setAdding(false); fetchGroups();
  };

  const handleUpdate = async () => {
    if (!editingGroup?.name) return;
    await apiPut(`/api/competitions/groups/${editingGroup.id}`, {
      name: editingGroup.name,
      metadata: editingGroup.metadata || {},
    }).catch(() => {});
    setEditingGroup(null); fetchGroups();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Eliminare questo girone?")) return;
    await apiDelete(`/api/competitions/groups/${id}`).catch(() => {});
    fetchGroups();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Gironi ({groups.length})</p>
        {!adding && <button onClick={() => setAdding(true)} className="text-xs text-blue-400 hover:text-blue-300 transition-colors">+ Aggiungi</button>}
      </div>

      {adding && (
        <div className="flex gap-2 mb-2">
          <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Es. Gruppo A" autoFocus className={`flex-1 ${inp}`} />
          <button onClick={handleAdd} className="text-sm bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded-lg transition-colors">Salva</button>
          <button onClick={() => setAdding(false)} className="text-sm text-slate-500 border border-slate-700 px-3 py-1 rounded-lg transition-colors">✕</button>
        </div>
      )}

      {groups.length === 0 && !adding && <p className="text-sm text-slate-500 py-2">Nessun girone definito.</p>}

      <div className="space-y-1">
        {groups.map((g) => (
          <div key={g.id} className="bg-slate-800/50 rounded-lg px-3 py-2 border border-slate-700">
            {editingGroup?.id === g.id ? (
              <GroupEditInline
                group={editingGroup}
                onChange={setEditingGroup}
                onSave={handleUpdate}
                onCancel={() => setEditingGroup(null)}
              />
            ) : (
              <GroupReadView
                g={g}
                onEdit={() => setEditingGroup({ ...g })}
                onDelete={() => handleDelete(g.id)}
                onCriteriaClick={() => setCriteriaModal(g.metadata?.tiebreakerCriteria ?? [])}
                onGroupUpdated={fetchGroups}
                editionId={phase.editionId}
              />
            )}
          </div>
        ))}
      </div>
      {criteriaModal && <CriteriaModal criteria={criteriaModal} onClose={() => setCriteriaModal(null)} />}
    </div>
  );
}

GroupsList.propTypes = {
  phase: PropTypes.shape({ id: PropTypes.number.isRequired, type: PropTypes.string.isRequired }).isRequired,
};
