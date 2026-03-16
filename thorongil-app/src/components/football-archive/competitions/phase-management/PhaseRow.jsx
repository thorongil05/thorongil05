import { useState } from "react";
import PropTypes from "prop-types";
import { apiDelete } from "../../../../utils/api";
import PhaseEditForm from "./PhaseEditForm";
import GroupsList from "./GroupsList";

const TYPE_STYLE = {
  GROUP: "text-blue-400 bg-blue-500/10 border-blue-500/30",
  KNOCKOUT: "text-purple-400 bg-purple-500/10 border-purple-500/30",
};
const TYPE_LABEL = { GROUP: "Gironi", KNOCKOUT: "Eliminazione" };

export default function PhaseRow({ phase, onUpdate, defaultExpanded = false }) {
  const [editing, setEditing] = useState(false);
  const [expanded, setExpanded] = useState(defaultExpanded);

  const handleDelete = async () => {
    if (!window.confirm("Eliminare questa fase?")) return;
    try {
      await apiDelete(`/api/competitions/phases/${phase.id}`);
      onUpdate();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleEdit = () => { setEditing((e) => !e); setExpanded(false); };
  const toggleExpand = () => { setExpanded((e) => !e); setEditing(false); };

  return (
    <div className="bg-slate-900/60 rounded-xl border border-slate-700 mb-2 overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="flex-1 min-w-0 flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-white">{phase.name}</span>
          <span className={`text-xs border px-2 py-0.5 rounded-full ${TYPE_STYLE[phase.type] ?? "text-slate-400 border-slate-600"}`}>
            {TYPE_LABEL[phase.type] ?? phase.type}
          </span>
          {phase.metadata?.participantsCount > 0 && (
            <span className="text-xs text-slate-500">{phase.metadata.participantsCount} partecipanti</span>
          )}
          {phase.metadata?.totalMatches > 0 && (
            <span className="text-xs text-slate-500">{phase.metadata.totalMatches} partite</span>
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button onClick={toggleEdit} className="text-xs text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 px-2.5 py-1 rounded-lg transition-colors">
            {editing ? "✕" : "✏️"}
          </button>
          <button onClick={handleDelete} className="text-xs text-slate-600 hover:text-red-400 border border-slate-700 hover:border-red-700/50 px-2.5 py-1 rounded-lg transition-colors">
            🗑️
          </button>
          <button onClick={toggleExpand} className="text-slate-500 hover:text-white text-sm px-2.5 py-1 transition-colors">
            {expanded ? "▲" : "▼"}
          </button>
        </div>
      </div>

      {editing && (
        <div className="border-t border-slate-700/50 p-4">
          <PhaseEditForm phase={phase} onSaved={() => { onUpdate(); setEditing(false); }} onCancel={() => setEditing(false)} />
        </div>
      )}

      {expanded && (
        <div className="border-t border-slate-700/50 p-4">
          <GroupsList phase={phase} />
        </div>
      )}
    </div>
  );
}

PhaseRow.propTypes = {
  phase: PropTypes.object.isRequired,
  onUpdate: PropTypes.func.isRequired,
  defaultExpanded: PropTypes.bool,
};
