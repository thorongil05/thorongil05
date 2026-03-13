import { useState } from 'react';
import { Box, Typography, Select, MenuItem, FormControl, InputLabel, Paper } from '@mui/material';
import { useFantacalcion, ROLES } from './context/FantacalcionContext';
import FootballPitch from './FootballPitch';
import PlayerSelectionModal from './PlayerSelectionModal';
import StatusFooter from './StatusFooter';

export default function FormationBuilder() {
  const { formationStr, setFormationStr, deployed } = useFantacalcion();
  const [modalOpen, setModalOpen] = useState(false);
  const [activeSlot, setActiveSlot] = useState({ id: null, role: null });

  const handleSlotClick = (slotId, requiredRole) => {
    setActiveSlot({ id: slotId, role: requiredRole });
    setModalOpen(true);
  };

  return (
    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
      
      {/* Controls */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Modulo</InputLabel>
          <Select
            value={formationStr}
            label="Modulo"
            onChange={e => setFormationStr(e.target.value)}
          >
            <MenuItem value="4-4-2">4-4-2</MenuItem>
            <MenuItem value="4-3-3">4-3-3</MenuItem>
            <MenuItem value="3-5-2">3-5-2</MenuItem>
            <MenuItem value="3-4-3">3-4-3</MenuItem>
            <MenuItem value="4-2-3-1">4-2-3-1</MenuItem>
            <MenuItem value="4-3-1-2">4-3-1-2</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Main Pitch */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto', mb: 2 }}>
        <FootballPitch 
          formation={formationStr} 
          deployed={deployed} 
          onSlotClick={handleSlotClick} 
        />

        {/* Bench */}
        <Box sx={{ mt: 4, maxWidth: 600, mx: 'auto' }}>
          <Typography variant="h6" align="center" mb={1}>Panchina (7 slot)</Typography>
          <Paper sx={{ p: 2, display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center', bgcolor: '#f5f5f5' }}>
            {Array.from({ length: 7 }).map((_, idx) => {
              const slotId = `bench-${idx}`;
              const player = deployed[slotId];
              return (
                <Box 
                  key={slotId}
                  onClick={() => handleSlotClick(slotId, 'DIF')} // We pass DIF but we allow DIF/CEN/ATT
                  sx={{ 
                    width: 65, height: 65, bgcolor: player ? '#1976d2' : 'white', 
                    borderRadius: 1, border: '1px dashed #ccc',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', transition: 'all 0.1s',
                    '&:hover': { borderColor: '#1976d2' }
                  }}
                >
                  <Typography variant="caption" color={player ? 'white' : 'text.secondary'} sx={{ fontWeight: 'bold' }}>
                    {player ? player.name.substring(0,6) : `Panc ${idx+1}`}
                  </Typography>
                  <Typography variant="caption" color={player ? 'white' : 'text.secondary'}>
                    {player ? player.role : '+'}
                  </Typography>
                </Box>
              );
            })}
          </Paper>
          <Typography variant="caption" color="text.secondary" display="block" align="center" mt={1}>
            Clicca per aggiungere (NO Portieri)
          </Typography>
        </Box>
      </Box>

      {/* Status Footer */}
      <StatusFooter />

      {/* Modal */}
      <PlayerSelectionModal 
        open={modalOpen} 
        onClose={() => setModalOpen(false)} 
        slotId={activeSlot.id} 
        requiredRole={activeSlot.role} 
      />
    </Box>
  );
}
