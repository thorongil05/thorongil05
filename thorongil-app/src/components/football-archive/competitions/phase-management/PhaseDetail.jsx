import { useState } from "react";
import PropTypes from "prop-types";
import PhaseEditForm from "./PhaseEditForm";
import GroupsList from "./GroupsList";

const TYPE_STYLE = {
  GROUP:    "text-blue-400 bg-blue-500/10 border-blue-500/30",
  KNOCKOUT: "text-purple-400 bg-purple-500/10 border-purple-500/30",
};
const TYPE_LABEL = { GROUP: "Gironi", KNOCKOUT: "Eliminazione" };
const FORMAT_LABELS = { GROUP: "Gironi all'italiana", KNOCKOUT: "Eliminazione diretta" };
const lbl = "text-xs text-slate-500";
const val = "text-sm text-slate-200 font-medium mt-0.5";

function PhaseReadView({ phase }) {
  return (
    <dl className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-3">
      <div><dt className={lbl}>Nome</dt><dd className={val}>{phase.name}</dd></div>
      <div><dt className={lbl}>Tipo</dt><dd className={val}>{FORMAT_LABELS[phase.type] ?? phase.type}</dd></div>
      {phase.metadata?.participantsCount > 0 && (
        <div><dt className={lbl}>Partecipanti</dt><dd className={val}>{phase.metadata.participantsCount}</dd></div>
      )}
      {phase.metadata?.totalMatches > 0 && (
        <div><dt className={lbl}>Partite totali</dt><dd className={val}>{phase.metadata.totalMatches}</dd></div>
      )}
      {phase.metadata?.matchesPerRound > 0 && (
        <div><dt className={lbl}>Partite per giornata</dt><dd className={val}>{phase.metadata.matchesPerRound}</dd></div>
      )}
    </dl>
  );
}

PhaseReadView.propTypes = { phase: PropTypes.object.isRequired };

export default function PhaseDetail({ phase, onUpdate, onBack }) {
  const [editing, setEditing] = useState(false);
  const [formKey, setFormKey] = useState(0);

  if (!phase) {
    return (
      <div className="flex-1 flex items-center justify-center h-full">
        <p className="text-sm text-slate-500">Seleziona una fase dalla lista.</p>
      </div>
    );
  }

  const handleSaved = () => {
    onUpdate();
    setEditing(false);
    setFormKey((k) => k + 1);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 py-3 border-b border-slate-800 shrink-0 flex items-center gap-3">
        <button onClick={onBack} className="text-slate-400 hover:text-white shrink-0 md:hidden">←</button>
        <h3 className="text-sm font-bold text-white truncate flex-1">{phase.name}</h3>
        <span className={`text-xs border px-2 py-0.5 rounded-full shrink-0 ${TYPE_STYLE[phase.type] ?? "text-slate-400 border-slate-600"}`}>
          {TYPE_LABEL[phase.type] ?? phase.type}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Configurazione</p>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="text-xs text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 px-2.5 py-1 rounded-lg transition-colors"
              >
                ✏️ Modifica
              </button>
            )}
          </div>
          {editing ? (
            <PhaseEditForm
              key={`${phase.id}-${formKey}`}
              phase={phase}
              onSaved={handleSaved}
              onCancel={() => setEditing(false)}
            />
          ) : (
            <PhaseReadView phase={phase} />
          )}
        </div>

        {phase.type === "GROUP" && (
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Gironi</p>
            <GroupsList phase={phase} />
          </div>
        )}

        {phase.type === "KNOCKOUT" && (
          <p className="text-sm text-slate-500">
            Fase a eliminazione diretta — gli accoppiamenti vengono gestiti nella sezione Partite.
          </p>
        )}
      </div>
    </div>
  );
}

PhaseDetail.propTypes = {
  phase: PropTypes.object,
  onUpdate: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
};
