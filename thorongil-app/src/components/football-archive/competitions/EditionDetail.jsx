import { useState } from "react";
import PropTypes from "prop-types";
import PhaseManagement from "./phase-management/PhaseManagement";
import EditionFormDialog from "./EditionFormDialog";

const FORMAT_LABELS = { LEAGUE: "Campionato", COMPOSTA: "Misto / Coppe" };
const STATUS_STYLE = {
  CURRENT:   "text-green-400 bg-green-500/10 border-green-500/30",
  INCOMING:  "text-blue-400 bg-blue-500/10 border-blue-500/30",
  COMPLETED: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
  ARCHIVED:  "text-slate-400 bg-slate-500/10 border-slate-500/30",
};
const STATUS_LABEL = {
  CURRENT: "In corso", INCOMING: "In arrivo", COMPLETED: "Completata", ARCHIVED: "Archiviata",
};

export default function EditionDetail({ edition, competitionId, canManage, onUpdate, onBack }) {
  const [editOpen, setEditOpen] = useState(false);

  if (!edition) {
    return (
      <div className="flex-1 flex items-center justify-center h-full">
        <p className="text-slate-500 text-sm">Seleziona un&apos;edizione dalla lista.</p>
      </div>
    );
  }

  const format = FORMAT_LABELS[edition.metadata?.competitionFormat];
  const statusLabel = STATUS_LABEL[edition.status];
  const hasPhases = edition.phases?.length > 0;

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 py-4 border-b border-slate-800 shrink-0 bg-slate-900/30">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="text-slate-400 hover:text-white shrink-0 md:hidden"
            aria-label="Torna alla lista"
          >
            ←
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-bold text-white truncate">{edition.name}</h2>
              {statusLabel && (
                <span className={`text-xs border px-2 py-0.5 rounded-full shrink-0 ${STATUS_STYLE[edition.status]}`}>
                  {statusLabel}
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 mt-0.5 text-xs text-slate-400">
              {format && <span>{format}</span>}
              {edition.metadata?.maxParticipants > 0 && (
                <span>{edition.metadata.maxParticipants} squadre</span>
              )}
            </div>
          </div>
          {canManage && (
            <button
              onClick={() => setEditOpen(true)}
              className="shrink-0 text-sm text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 px-3 py-1.5 rounded-lg transition-colors"
            >
              ✏️ Modifica
            </button>
          )}
        </div>
      </div>

      {!hasPhases && (
        <p className="text-sm text-amber-400 px-5 pt-3">⚠️ Nessuna fase definita. Aggiungine una qui sotto.</p>
      )}
      <div className="flex-1 overflow-hidden p-4 md:p-5">
        <PhaseManagement editionId={edition.id} />
      </div>

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

EditionDetail.propTypes = {
  edition: PropTypes.object,
  competitionId: PropTypes.number.isRequired,
  canManage: PropTypes.bool,
  onUpdate: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
};
