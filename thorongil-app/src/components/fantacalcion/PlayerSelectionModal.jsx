import { useState, useMemo, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Select, MenuItem, FormControl, InputLabel, Box, Typography, Divider } from '@mui/material';
import { useFantacalcion } from './context/FantacalcionContext';

export default function PlayerSelectionModal({ open, onClose, slotId, requiredRole }) {
  const { players, availableTeams, deployPlayer, deployed, removeDeployedSlot } = useFantacalcion();
  
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedPlayerId, setSelectedPlayerId] = useState('');

  const isGoalkeeper = requiredRole === 'POR';

  // Initialize from current deployed player if any
  useEffect(() => {
    if (open) {
      const current = deployed[slotId];
      if (current) {
        setSelectedTeam(current.team_name);
        setSelectedPlayerId(isGoalkeeper ? '' : current.id);
      } else {
        setSelectedTeam('');
        setSelectedPlayerId('');
      }
    }
  }, [open, slotId, deployed, isGoalkeeper]);

  // Teams that are available (not used) PLUS the team of the currently selected player in THIS slot
  const teamOptions = useMemo(() => {
    const current = deployed[slotId];
    let list = [...availableTeams];
    if (current && !list.includes(current.team_name)) {
      list.push(current.team_name);
    }
    return list.sort();
  }, [availableTeams, deployed, slotId]);

  // Players filtered by selected team and required role
  const playerOptions = useMemo(() => {
    if (!selectedTeam || isGoalkeeper) return [];
    return players
      .filter(p => p.team_name === selectedTeam && p.role === requiredRole)
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [players, selectedTeam, requiredRole, isGoalkeeper]);

  const handleSave = () => {
    if (isGoalkeeper) {
      if (!selectedTeam) {
        removeDeployedSlot(slotId);
      } else {
        deployPlayer(slotId, { 
          id: `gk-${selectedTeam}`, 
          name: `${selectedTeam} (Blocco)`, 
          role: 'POR', 
          team_name: selectedTeam 
        });
      }
    } else {
      if (!selectedPlayerId) {
        removeDeployedSlot(slotId);
      } else {
        const player = players.find(p => p.id === selectedPlayerId);
        if (player) deployPlayer(slotId, player);
      }
    }
    onClose();
  };

  const handleClear = () => {
    removeDeployedSlot(slotId);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold' }}>
        Seleziona {isGoalkeeper ? 'Portiere' : 'Giocatore'}
        <Typography variant="body2" color="primary">{requiredRole}</Typography>
      </DialogTitle>
      
      <DialogContent sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ mt: 1 }}>
          <Typography variant="overline" color="textSecondary" sx={{ fontWeight: 'bold' }}>1. SELEZIONA SQUADRA</Typography>
          <FormControl fullWidth size="small">
            <InputLabel>Squadra</InputLabel>
            <Select
              value={selectedTeam}
              label="Squadra"
              onChange={e => {
                setSelectedTeam(e.target.value);
                setSelectedPlayerId('');
              }}
            >
              <MenuItem value=""><em>Nessuna</em></MenuItem>
              {teamOptions.map(t => (
                <MenuItem key={t} value={t}>{t}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Typography variant="caption" color="textSecondary">Mostra solo squadre non ancora utilizzate</Typography>
        </Box>

        {!isGoalkeeper && (
          <Box>
            <Typography variant="overline" color="textSecondary" sx={{ fontWeight: 'bold' }}>2. SELEZIONA GIOCATORE</Typography>
            <FormControl fullWidth size="small" disabled={!selectedTeam}>
              <InputLabel>Giocatore</InputLabel>
              <Select
                value={selectedPlayerId}
                label="Giocatore"
                onChange={e => setSelectedPlayerId(e.target.value)}
              >
                <MenuItem value=""><em>Nessuno</em></MenuItem>
                {playerOptions.map(p => (
                  <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            {selectedTeam && playerOptions.length === 0 && (
              <Typography variant="caption" color="error">Nessun {requiredRole} trovato per questa squadra</Typography>
            )}
          </Box>
        )}

        {isGoalkeeper && selectedTeam && (
          <Box sx={{ p: 2, bgcolor: 'primary.light', borderRadius: 1, color: 'white', textAlign: 'center' }}>
            <Typography variant="body2" fontWeight="bold">Blocco Portieri: {selectedTeam}</Typography>
          </Box>
        )}
      </DialogContent>

      <Divider />
      
      <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
        <Button onClick={handleClear} color="error" variant="text">Rimuovi</Button>
        <Box>
          <Button onClick={onClose} color="inherit" sx={{ mr: 1 }}>Annulla</Button>
          <Button 
            onClick={handleSave} 
            variant="contained" 
            disabled={isGoalkeeper ? !selectedTeam : !selectedPlayerId}
          >
            Conferma
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
