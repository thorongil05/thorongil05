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
    <Box sx={{ p: { xs: 1, md: 3 }, display: 'flex', flexDirection: 'column', height: '100%', overflowX: 'hidden', bgcolor: '#f8f9fa' }}>
      
      {/* Controls */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <Paper elevation={0} sx={{ p: 1, borderRadius: 3, border: '1px solid #e0e0e0', display: 'inline-flex' }}>
          <FormControl sx={{ minWidth: 200 }} size="small">
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
        </Paper>
      </Box>

      {/* Main Area: Pitch + Sidebar */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, flexGrow: 1, overflow: 'hidden', gap: { xs: 2, md: 4 } }}>
        
        {/* Pitch & Bench Container */}
        <Box sx={{ flexGrow: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', px: { xs: 0, md: 2 } }}>
          <FootballPitch 
            formation={formationStr} 
            deployed={deployed} 
            onSlotClick={handleSlotClick} 
          />

        {/* Bench */}
        <Box sx={{ mt: 2, maxWidth: 600, mx: 'auto' }}>
          <Typography variant="subtitle2" align="center" mb={1}>Panchina (7 slot: 2D, 2C, 3A)</Typography>
          <Paper sx={{ p: 1, display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center', bgcolor: '#f5f5f5' }}>
            {Array.from({ length: 7 }).map((_, idx) => {
              const slotId = `bench-${idx}`;
              const player = deployed[slotId];
              
              // Define roles for each bench slot
              let forcedRole = 'DIF';
              if (idx >= 2 && idx < 4) forcedRole = 'CEN';
              if (idx >= 4) forcedRole = 'ATT';

              return (
                <Box 
                  key={slotId}
                  onClick={() => handleSlotClick(slotId, forcedRole)}
                  sx={{ 
                    width: { xs: 55, sm: 65 }, height: { xs: 55, sm: 65 }, bgcolor: player ? '#1976d2' : 'white', 
                    borderRadius: 1, border: '1px dashed #ccc',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', transition: 'all 0.1s',
                    '&:hover': { borderColor: '#1976d2' }
                  }}
                >
                  <Typography variant="caption" color={player ? 'white' : 'text.secondary'} sx={{ fontWeight: 'bold' }}>
                    {player ? player.name.substring(0,8) : forcedRole}
                  </Typography>
                  <Typography variant="caption" color={player ? 'white' : 'text.secondary'}>
                    {player ? player.team_name.substring(0,3).toUpperCase() : `P${idx+1}`}
                  </Typography>
                </Box>
              );
            })}
          </Paper>
          <Typography variant="caption" color="text.secondary" display="block" align="center" mt={1} mb={2}>
            Clicca per aggiungere (2 DIF, 2 CEN, 3 ATT)
          </Typography>
        </Box>
      </Box>

      {/* Status Panel (Side on Desktop, Bottom on Mobile) */}
      <Box sx={{ width: { xs: '100%', md: 350 }, flexShrink: 0, overflowY: 'auto' }}>
        <StatusFooter />
      </Box>
    </Box>

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
