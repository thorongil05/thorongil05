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
        maxWidth: { xs: 320, sm: 380 },
        aspectRatio: { xs: '0.7', sm: '0.8' },
        bgcolor: '#2e7d32',
        border: '3px solid white',
        borderRadius: 2,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        p: { xs: 1, sm: 2 },
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '100% 10%'
      }}
    >
      {/* Pitch Lines decorations */}
      <Box sx={{ position: 'absolute', top: 0, left: '20%', right: '20%', height: '15%', border: '2px solid rgba(255,255,255,0.3)', borderTop: 'none' }} />
      <Box sx={{ position: 'absolute', bottom: 0, left: '20%', right: '20%', height: '15%', border: '2px solid rgba(255,255,255,0.3)', borderBottom: 'none' }} />
      <Box sx={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', bgcolor: 'rgba(255,255,255,0.3)' }} />
      <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 60, height: 60, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)' }} />

      {/* Players */}
      {lines.map((pCount, lineIdx) => {
        const requiredRole = getRoleForLine(lineIdx, lines.length);

        return (
          <Box key={`line-${lineIdx}`} sx={{ display: 'flex', justifyContent: 'center', gap: { xs: 1, sm: 2 }, zIndex: 10 }}>
            {Array.from({ length: pCount }).map(() => {
              const currentSlotId = `starter-${slotCounter++}`;
              const player = deployed[currentSlotId];

              return (
                <Box
                  key={currentSlotId}
                  onClick={() => onSlotClick(currentSlotId, requiredRole)}
                  sx={{
                    width: { xs: 55, sm: 65 }, height: { xs: 70, sm: 80 },
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    cursor: 'pointer', transition: 'transform 0.1s',
                    '&:hover': { transform: 'scale(1.1)' }
                  }}
                >
                  <Box sx={{
                    width: { xs: 45, sm: 50 }, height: { xs: 45, sm: 50 }, borderRadius: '50%',
                    bgcolor: player ? '#1976d2' : 'rgba(255,255,255,0.2)',
                    border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontWeight: 'bold', fontSize: { xs: '0.85rem', sm: '1.1rem' },
                    boxShadow: player ? '0 4px 8px rgba(0,0,0,0.3)' : 'none'
                  }}>
                    {player ? player.role.charAt(0) : '+'}
                  </Box>
                  <Typography variant="caption" sx={{ color: 'white', bgcolor: 'rgba(0,0,0,0.6)', px: 0.8, py: 0.2, borderRadius: 1, whiteSpace: 'nowrap', mt: 0.5, fontSize: { xs: 10, sm: 11 }, fontWeight: 'medium' }}>
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
