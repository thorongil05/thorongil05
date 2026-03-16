import { useState } from "react";
import PropTypes from "prop-types";
import PhaseManagement from "./phase-management/PhaseManagement";
import EditionFormDialog from "./EditionFormDialog";
import { useAuth } from "../../../context/AuthContext";
import { UserRoles } from "../../../constants/roles";

const FORMAT_LABELS = { LEAGUE: "Campionato", COMPOSTA: "Misto / Coppe" };
const STATUS_STYLE = {
  CURRENT:   "text-green-400 bg-green-500/10 border-green-500/30",
  INCOMING:  "text-blue-400 bg-blue-500/10 border-blue-500/30",
  COMPLETED: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
  ARCHIVED:  "text-slate-400 bg-slate-500/10 border-slate-500/30",
};
const STATUS_LABEL = { CURRENT: "In corso", INCOMING: "In arrivo", COMPLETED: "Completata", ARCHIVED: "Archiviata" };

function StatusBadge({ status }) {
  if (!status || !STATUS_LABEL[status]) return null;
  return (
    <span className={`text-xs border px-2 py-0.5 rounded-full shrink-0 ${STATUS_STYLE[status]}`}>
      {STATUS_LABEL[status]}
    </span>
  );
}
StatusBadge.propTypes = { status: PropTypes.string };

export default function EditionRow({ edition, competitionId, onUpdate, defaultExpanded = false }) {
  const { user } = useAuth();
  const canManage = user?.role === UserRoles.ADMIN || user?.role === UserRoles.EDITOR;
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [editOpen, setEditOpen] = useState(false);
  const hasPhases = edition.phases?.length > 0;
  const format = FORMAT_LABELS[edition.metadata?.competitionFormat] ?? edition.metadata?.competitionFormat;

  return (
    <div className="bg-slate-800/50 rounded-xl border border-slate-700 mb-2 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 gap-3">
        <div className="flex items-center gap-4 min-w-0 flex-1">
          <div className="min-w-0">
            <span className="text-sm font-semibold text-white">{edition.name}</span>
            <div className="flex items-center gap-2 mt-0.5">
              {format && <span className="text-xs text-slate-400">{format}</span>}
              {edition.metadata?.maxParticipants > 0 && (
                <span className="text-xs text-slate-500">{edition.metadata.maxParticipants} squadre</span>
              )}
            </div>
          </div>
          <StatusBadge status={edition.status} />
          {hasPhases
            ? <span className="text-xs text-slate-500 shrink-0">{edition.phases.length} {edition.phases.length === 1 ? "fase" : "fasi"}</span>
            : <span className="text-xs bg-amber-900/40 text-amber-400 border border-amber-700/50 px-2 py-0.5 rounded-full shrink-0">Nessuna fase</span>
          }
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {canManage && (
            <button onClick={() => setEditOpen(true)} className="text-xs text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 px-2.5 py-1 rounded-lg transition-colors">
              ✏️
            </button>
          )}
          <button onClick={() => setExpanded((e) => !e)} className="text-slate-500 hover:text-white text-sm px-2.5 py-1 transition-colors">
            {expanded ? "▲" : "▼"}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-slate-700/50">
          {!hasPhases && (
            <p className="text-sm text-amber-400 px-4 pt-3 pb-1">⚠️ Nessuna fase definita. Aggiungine una qui sotto.</p>
          )}
          <PhaseManagement editionId={edition.id} />
        </div>
      )}

      {canManage && (
        <EditionFormDialog
          open={editOpen}
          onClose={() => setEditOpen(false)}
          editionToEdit={edition}
          competitionId={competitionId}
          onSuccess={onUpdate}
        />
      )}
    </div>
  );
}

EditionRow.propTypes = {
  edition: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    phases: PropTypes.array,
    metadata: PropTypes.object,
  }).isRequired,
  competitionId: PropTypes.number,
  onUpdate: PropTypes.func.isRequired,
  defaultExpanded: PropTypes.bool,
};
