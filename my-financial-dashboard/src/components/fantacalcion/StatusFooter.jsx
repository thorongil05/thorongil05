import { Box, Typography } from '@mui/material';
import { useFantacalcion } from './context/FantacalcionContext';

export default function StatusFooter() {
  const { deployed, availableTeams, getUsedTeams } = useFantacalcion();

  const totalSlots = 18; // 11 starters + 7 bench
  const deployedCount = Object.keys(deployed).length;
  const isComplete = deployedCount === totalSlots;

  const exportFormation = () => {
    // Generate text based on required format
    // Format: SASSUOLO\nBastoni (INT)\n...
    // Bench: Panchinaro 1 (SQD)\n...
    let starters = [];
    let bench = [];
    let goalkeeper = null;

    Object.entries(deployed).forEach(([slotId, player]) => {
      const isBench = slotId.startsWith('bench-');
      if (player.role === 'POR') {
        goalkeeper = player;
      } else {
        const text = `${player.name} (${player.team.slice(0, 3).toUpperCase()})`;
        if (isBench) bench.push(text);
        else starters.push(text);
      }
    });

    const outTeams = availableTeams.join(', ');

    const draft = [
      'Formazione Fantacalcion',
      '',
      goalkeeper ? goalkeeper.team : 'Nessun Portiere',
      ...starters,
      '',
      ...bench.map((b, i) => `Panchinaro ${i + 1} - ${b}`),
      '',
      `Out: ${outTeams}`
    ].join('\n');

    navigator.clipboard.writeText(draft);
    alert('Formazione copiata negli appunti!');
  };

  return (
    <Box sx={{ p: 2, borderTop: '1px solid #ccc', bgcolor: 'background.paper', display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Giocatori inseriti: {deployedCount} / {totalSlots}
        </Typography>
        <button 
          onClick={exportFormation}
          disabled={!isComplete}
          className={`px-4 py-2 rounded font-bold text-white transition-colors
            ${isComplete ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'}
          `}
        >
          {isComplete ? 'Esporta Formazione' : 'Completa per esportare'}
        </button>
      </Box>

      <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        <strong>Squadre Disponibili:</strong> 
        {availableTeams.map(t => (
          <span key={t} className="bg-blue-100 text-blue-800 px-1 py-0.5 rounded text-xs">
            {t}
          </span>
        ))}
      </Typography>
    </Box>
  );
}
