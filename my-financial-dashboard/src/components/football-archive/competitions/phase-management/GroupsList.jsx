import { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { apiGet, apiPost, apiPut, apiDelete } from "../../../../utils/api";

const inp = "bg-slate-700 border border-slate-600 text-white text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500";

export default function GroupsList({ phase }) {
  const [groups, setGroups] = useState([]);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");

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
    await apiPut(`/api/competitions/groups/${editingId}`, { name: editingName }).catch(() => {});
    setEditingId(null); fetchGroups();
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
          <div key={g.id} className="flex items-center gap-2 bg-slate-800/50 rounded-lg px-3 py-2 border border-slate-700">
            {editingId === g.id ? (
              <>
                <input value={editingName} onChange={(e) => setEditingName(e.target.value)} autoFocus className={`flex-1 ${inp}`} />
                <button onClick={handleUpdate} className="text-xs text-blue-400 hover:text-blue-300">✓</button>
                <button onClick={() => setEditingId(null)} className="text-xs text-slate-500 hover:text-white">✕</button>
              </>
            ) : (
              <>
                <span className="text-sm text-slate-200 flex-1">{g.name}</span>
                <button onClick={() => { setEditingId(g.id); setEditingName(g.name); }} className="text-xs text-slate-500 hover:text-slate-300 transition-colors">✏️</button>
                <button onClick={() => handleDelete(g.id)} className="text-xs text-slate-600 hover:text-red-400 transition-colors">🗑️</button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

GroupsList.propTypes = {
  phase: PropTypes.shape({ id: PropTypes.number.isRequired, type: PropTypes.string.isRequired }).isRequired,
};
