import PropTypes from "prop-types";

const STATUS_STYLE = {
  CURRENT:   "text-green-400 bg-green-500/10 border-green-500/30",
  INCOMING:  "text-blue-400 bg-blue-500/10 border-blue-500/30",
  COMPLETED: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
  ARCHIVED:  "text-slate-400 bg-slate-500/10 border-slate-500/30",
};
const STATUS_LABEL = {
  CURRENT: "In corso", INCOMING: "In arrivo", COMPLETED: "Completata", ARCHIVED: "Archiviata",
};
const lbl = "text-xs font-semibold text-slate-500 uppercase tracking-wider px-2 mb-1";

function EditionItem({ edition, selected, onClick }) {
  const statusLabel = STATUS_LABEL[edition.status];
  const statusCls = STATUS_STYLE[edition.status] ?? "text-slate-400 border-slate-600";
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-2.5 rounded-xl border transition-all ${
        selected
          ? "bg-blue-500/10 border-blue-500/30 text-white"
          : "border-transparent hover:bg-slate-800 text-slate-300"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-semibold truncate">{edition.name}</span>
        {statusLabel && (
          <span className={`text-xs border px-2 py-0.5 rounded-full shrink-0 ${statusCls}`}>
            {statusLabel}
          </span>
        )}
      </div>
      <p className="text-xs text-slate-500 mt-0.5">
        {edition.phases?.length
          ? `${edition.phases.length} ${edition.phases.length === 1 ? "fase" : "fasi"}`
          : "Nessuna fase"}
      </p>
    </button>
  );
}

EditionItem.propTypes = {
  edition: PropTypes.object.isRequired,
  selected: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default function EditionSidebar({ editions, selectedId, onSelect, onAdd, canManage }) {
  const current = editions.filter((e) => e.status === "CURRENT");
  const other = editions.filter((e) => e.status !== "CURRENT");

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
        {editions.length === 0 && (
          <p className="text-sm text-slate-500 text-center py-8">Nessuna edizione.</p>
        )}
        {current.length > 0 && (
          <div>
            <p className={lbl}>In corso</p>
            {current.map((e) => (
              <EditionItem key={e.id} edition={e} selected={selectedId === e.id} onClick={() => onSelect(e)} />
            ))}
          </div>
        )}
        {other.length > 0 && (
          <div>
            <p className={lbl}>Archivio</p>
            {other.map((e) => (
              <EditionItem key={e.id} edition={e} selected={selectedId === e.id} onClick={() => onSelect(e)} />
            ))}
          </div>
        )}
      </div>
      {canManage && (
        <div className="px-3 py-3 border-t border-slate-800 shrink-0">
          <button
            onClick={onAdd}
            className="w-full text-sm text-center text-blue-400 hover:text-blue-300 py-2 border border-dashed border-slate-700 hover:border-blue-500/50 rounded-xl transition-colors"
          >
            + Aggiungi edizione
          </button>
        </div>
      )}
    </div>
  );
}

EditionSidebar.propTypes = {
  editions: PropTypes.array.isRequired,
  selectedId: PropTypes.number,
  onSelect: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
  canManage: PropTypes.bool,
};
