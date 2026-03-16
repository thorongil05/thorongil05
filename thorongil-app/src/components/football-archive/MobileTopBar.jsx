import PropTypes from "prop-types";

export default function MobileTopBar({ data, onOpenSheet }) {
  const { selectedCompetition, selectedEdition } = data;

  const label = selectedCompetition
    ? `${selectedCompetition.name}${selectedEdition ? ` · ${selectedEdition.name}` : ""}`
    : "Seleziona campionato";

  return (
    <header className="md:hidden h-16 shrink-0 flex items-center justify-between px-4 border-b border-slate-800 bg-slate-900/95 backdrop-blur-md sticky top-0 z-40">
      <div className="flex items-center gap-2">
        <span className="bg-blue-500 p-1.5 rounded-md text-white text-sm leading-none">⚽</span>
        <span className="font-bold text-white tracking-tight">Football Archive</span>
      </div>
      <button
        onClick={onOpenSheet}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs border transition-all max-w-[160px] ${
          selectedCompetition
            ? "border-blue-500/30 bg-blue-500/10 text-blue-400"
            : "border-slate-700 bg-slate-800 text-slate-400"
        }`}
      >
        <span className="truncate">{label}</span>
        <span className="shrink-0 text-slate-500">▾</span>
      </button>
    </header>
  );
}

MobileTopBar.propTypes = {
  data: PropTypes.object.isRequired,
  onOpenSheet: PropTypes.func.isRequired,
};
