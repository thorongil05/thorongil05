import { useState } from "react";
import PropTypes from "prop-types";
import CurrentEditionCard from "./CurrentEditionCard";
import EditionRow from "./EditionRow";
import EditionFormDialog from "./EditionFormDialog";

const sectionLbl = "text-xs font-semibold text-slate-500 uppercase tracking-wider";

export default function EditionsList({ competitionId, editions, onUpdate }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const current = editions.filter((e) => e.status === "CURRENT");
  const archive = editions.filter((e) => e.status !== "CURRENT");

  return (
    <div className="space-y-8">
      {current.length > 0 && (
        <div>
          <p className={`${sectionLbl} mb-3`}>Edizione Corrente</p>
          {current.map((e) => (
            <CurrentEditionCard key={e.id} edition={e} competitionId={competitionId} onUpdate={onUpdate} />
          ))}
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-3">
          <p className={sectionLbl}>Archivio Edizioni</p>
          <button
            onClick={() => setDialogOpen(true)}
            className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-2.5 py-1 rounded-lg transition-colors"
          >
            + Aggiungi Edizione
          </button>
        </div>

        {editions.length === 0 ? (
          <div className="flex items-start gap-3 bg-amber-900/20 border border-amber-700/40 text-amber-300 rounded-xl p-4">
            <span className="text-lg leading-none mt-0.5">⚠️</span>
            <div>
              <p className="text-sm font-semibold">Nessuna edizione definita</p>
              <p className="text-xs text-amber-400/70 mt-1">Aggiungi almeno un&apos;edizione per iniziare a gestire le partite.</p>
            </div>
          </div>
        ) : archive.length === 0 ? (
          <p className="text-sm text-slate-500 py-2">Nessuna edizione in archivio.</p>
        ) : (
          archive.map((e) => <EditionRow key={e.id} edition={e} competitionId={competitionId} onUpdate={onUpdate} />)
        )}
      </div>

      <EditionFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        competitionId={competitionId}
        onSuccess={onUpdate}
      />
    </div>
  );
}

EditionsList.propTypes = {
  competitionId: PropTypes.number.isRequired,
  editions: PropTypes.array.isRequired,
  onUpdate: PropTypes.func.isRequired,
};
