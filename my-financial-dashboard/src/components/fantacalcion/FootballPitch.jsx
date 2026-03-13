import { Box, Typography } from '@mui/material';

const FORMATION_MAP = {
  '4-4-2': [1, 4, 4, 2],
  '4-3-3': [1, 4, 3, 3],
  '3-5-2': [1, 3, 5, 2],
  '3-4-3': [1, 3, 4, 3],
  '4-2-3-1': [1, 4, 2, 3, 1],
  '4-3-1-2': [1, 4, 3, 1, 2]
};

const ROLES_ORDER = {
  0: 'POR',
  1: 'DIF',
  2: 'CEN', // usually CEN
  3: 'ATT', // default, overridden if 5 lines
  4: 'ATT'
};

function getRoleForLine(lineIndex, totalLines) {
  if (lineIndex === 0) return 'POR';
  if (lineIndex === 1) return 'DIF';
  if (lineIndex === totalLines - 1) return 'ATT';
  if (totalLines === 5) {
    if (lineIndex === 2) return 'CEN'; // Mediani
    if (lineIndex === 3) return 'CEN'; // Trequartisti
  }
  return 'CEN'; // fallback
}

export default function FootballPitch({ formation, deployed, onSlotClick }) {
  const lines = FORMATION_MAP[formation] || FORMATION_MAP['4-4-2'];

  let slotCounter = 0;

  return (
    <Box 
      sx={{ 
        width: '100%', 
        maxWidth: 600, 
        mx: 'auto',
        aspectRatio: '0.7', 
        bgcolor: '#2e7d32', 
        border: '4px solid white', 
        borderRadius: 2,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        p: 2,
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '100% 10%'
      }}
    >
      {/* Pitch Lines decorations */}
      <Box sx={{ position: 'absolute', top: 0, left: '20%', right: '20%', height: '15%', border: '2px solid white', borderTop: 'none' }} />
      <Box sx={{ position: 'absolute', bottom: 0, left: '20%', right: '20%', height: '15%', border: '2px solid white', borderBottom: 'none' }} />
      <Box sx={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '2px', bgcolor: 'white' }} />
      <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 60, height: 60, borderRadius: '50%', border: '2px solid white' }} />

      {/* Players */}
      {lines.map((pCount, lineIdx) => {
        const requiredRole = getRoleForLine(lineIdx, lines.length);

        return (
          <Box key={`line-${lineIdx}`} sx={{ display: 'flex', justifyContent: 'center', gap: 2, zIndex: 10 }}>
            {Array.from({ length: pCount }).map((_, colIdx) => {
              const currentSlotId = `starter-${slotCounter++}`;
              const player = deployed[currentSlotId];
              
              return (
                <Box 
                  key={currentSlotId}
                  onClick={() => onSlotClick(currentSlotId, requiredRole)}
                  sx={{ 
                    width: 50, height: 60, 
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    cursor: 'pointer', transition: 'transform 0.1s',
                    '&:hover': { transform: 'scale(1.1)' }
                  }}
                >
                  <Box sx={{ 
                    width: 40, height: 40, borderRadius: '50%', 
                    bgcolor: player ? '#1976d2' : 'rgba(255,255,255,0.5)',
                    border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontWeight: 'bold'
                  }}>
                    {player ? player.role.charAt(0) : '+'}
                  </Box>
                  <Typography variant="caption" sx={{ color: 'white', bgcolor: 'rgba(0,0,0,0.5)', px: 0.5, borderRadius: 1, whiteSpace: 'nowrap', mt: 0.5, fontSize: 10 }}>
                    {player ? player.name.split(' ')[0] : requiredRole}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        );
      })}
    </Box>
  );
}
