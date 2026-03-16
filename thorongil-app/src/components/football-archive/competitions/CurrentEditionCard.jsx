import { useState } from "react";
import PropTypes from "prop-types";
import { useAuth } from "../../../context/AuthContext";
import { UserRoles } from "../../../constants/roles";
import PhaseManagement from "./phase-management/PhaseManagement";
import EditionFormDialog from "./EditionFormDialog";

const FORMAT_LABELS = { LEAGUE: "Campionato", COMPOSTA: "Misto / Coppe" };

export default function CurrentEditionCard({ edition, competitionId, onUpdate }) {
  const { user } = useAuth();
  const canManage = user?.role === UserRoles.ADMIN || user?.role === UserRoles.EDITOR;
  const [editOpen, setEditOpen] = useState(false);
  const hasPhases = edition.phases?.length > 0;
  const format = FORMAT_LABELS[edition.metadata?.competitionFormat] ?? edition.metadata?.competitionFormat;

  return (
    <div className="bg-slate-900 rounded-2xl border border-green-500/20 overflow-hidden">
      <div className="flex items-start justify-between px-5 py-4 border-b border-slate-700/50 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-base font-bold text-white">{edition.name}</h3>
            <span className="text-xs border px-2 py-0.5 rounded-full text-green-400 bg-green-500/10 border-green-500/30">
              In corso
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-400">
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

      <div className="px-5 py-4">
        {!hasPhases && (
          <p className="text-sm text-amber-400 mb-3">⚠️ Nessuna fase definita. Aggiungine una qui sotto.</p>
        )}
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

CurrentEditionCard.propTypes = {
  edition: PropTypes.object.isRequired,
  competitionId: PropTypes.number,
  onUpdate: PropTypes.func.isRequired,
};
