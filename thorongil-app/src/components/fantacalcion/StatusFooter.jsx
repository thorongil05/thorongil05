import { useFantacalcion } from './context/FantacalcionContext';

const TOTAL_SLOTS = 18;

export default function StatusFooter() {
  const { deployed, availableTeams } = useFantacalcion();

  const deployedCount = Object.keys(deployed).length;
  const isComplete = deployedCount === TOTAL_SLOTS;

  const exportFormation = () => {
    const starters = [];
    const bench = [];
    let goalkeeper = null;

    Object.entries(deployed).forEach(([slotId, player]) => {
      const isBench = slotId.startsWith('bench-');
      if (player.role === 'POR') {
        goalkeeper = player;
      } else {
        const text = `${player.name} (${player.team_name.slice(0, 3).toUpperCase()})`;
        if (isBench) bench.push(text);
        else starters.push(text);
      }
    });

    const draft = [
      'Formazione Fantacalcion', '',
      goalkeeper ? goalkeeper.team_name : 'Nessun Portiere',
      ...starters, '',
      ...bench.map((b, i) => `Panchinaro ${i + 1} - ${b}`), '',
      `Out: ${availableTeams.join(', ')}`,
    ].join('\n');

    navigator.clipboard.writeText(draft);
    alert('Formazione copiata negli appunti!');
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-4">
      <div>
        <h3 className="text-white font-bold mb-1">Stato Formazione</h3>
        <p className="text-slate-400 text-sm mb-3">
          Hai inserito <strong className="text-white">{deployedCount}</strong> giocatori su {TOTAL_SLOTS}.
        </p>
        <button
          onClick={exportFormation}
          disabled={!isComplete}
          className={`w-full px-4 py-3 rounded-lg font-bold text-white transition-colors ${
            isComplete ? 'bg-green-600 hover:bg-green-500' : 'bg-slate-700 cursor-not-allowed text-slate-500'
          }`}
        >
          {isComplete ? 'Esporta Formazione' : 'Completa per esportare'}
        </button>
      </div>
      <div>
        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
          Squadre Disponibili ({availableTeams.length})
        </p>
        <div className="flex flex-wrap gap-1">
          {availableTeams.map(t => (
            <span key={t} className="bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded text-xs font-medium">
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
