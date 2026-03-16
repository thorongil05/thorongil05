import { Box, Typography } from '@mui/material';
import { useFantacalcion } from './context/FantacalcionContext';

export default function StatusFooter() {
  const { deployed, availableTeams } = useFantacalcion();

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
        const text = `${player.name} (${player.team_name.slice(0, 3).toUpperCase()})`;
        if (isBench) bench.push(text);
        else starters.push(text);
      }
    });

    const outTeams = availableTeams.join(', ');

    const draft = [
      'Formazione Fantacalcion',
      '',
      goalkeeper ? goalkeeper.team_name : 'Nessun Portiere',
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
    <Box sx={{ 
      p: 3, 
      border: '1px solid #e0e0e0', 
      borderRadius: 4, 
      bgcolor: 'white', 
      display: 'flex', 
      flexDirection: 'column', 
      gap: 4, 
      height: 'fit-content',
      boxShadow: '0 2px 12px rgba(0,0,0,0.05)'
    }}>
      
      <Box>
        <Typography variant="h6" fontWeight="bold" color="primary" gutterBottom>
          Stato Formazione
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Hai inserito <strong>{deployedCount}</strong> giocatori su un totale di {totalSlots}.
        </Typography>
        
        <button 
          onClick={exportFormation}
          disabled={!isComplete}
          className={`w-full px-4 py-3 rounded font-bold text-white transition-colors
            ${isComplete ? 'bg-green-600 hover:bg-green-700 shadow-md' : 'bg-gray-300 cursor-not-allowed'}
          `}
        >
          {isComplete ? 'Esporta Formazione' : 'Completa per esportare'}
        </button>
      </Box>

      <Box>
        <Typography variant="subtitle2" mb={1}>Squadre Disponibili ({availableTeams.length}):</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {availableTeams.map(t => (
            <span key={t} className="bg-blue-50 text-blue-800 border border-blue-200 px-2 py-1 rounded text-xs font-medium">
              {t}
            </span>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
