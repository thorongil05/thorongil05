import { useState, useMemo } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useFantacalcion, SERIE_A_TEAMS } from './context/FantacalcionContext';

export default function PlayerSelectionModal({ open, onClose, slotId, requiredRole }) {
  const { players, getAvailablePlayersForRole, availableTeams, deployPlayer, deployed, removeDeployedSlot } = useFantacalcion();
  const [selectedValue, setSelectedValue] = useState('');

  // Determine what list to show
  const isGoalkeeper = requiredRole === 'POR';

  const options = useMemo(() => {
    if (!open) return [];
    
    // If there's already a deployed player, we might want them in the list to "re-select" them 
    // or just rely on clear to remove. For simplicity, we just list the currently available ones.
    const currentDeployed = deployed[slotId];
    
    if (isGoalkeeper) {
      // For GK, we list Teams that are available.
      // If a team is currently deployed in THIS slot, we include it in available.
      let teams = [...availableTeams];
      if (currentDeployed?.team) {
        teams.push(currentDeployed.team);
      }
      return Array.from(new Set(teams)).sort().map(team => ({
        value: team,
        label: `${team} (Blocco Portieri)`,
        playerObj: { id: `gk-${team}`, name: `${team} (Blocco)`, role: 'POR', team }
      }));
    } else {
      // Find players for this role that are in available teams OR are the currently deployed player
      const availablePlayers = getAvailablePlayersForRole(requiredRole);
      let list = [...availablePlayers];
      if (currentDeployed) {
        // Prevent duplicates just in case
        if (!list.find(p => p.id === currentDeployed.id)) {
          list.push(currentDeployed);
        }
      }
      return list.sort((a,b) => a.name.localeCompare(b.name)).map(p => ({
        value: p.id,
        label: `${p.name} (${p.team.substring(0,3).toUpperCase()})`,
        playerObj: p
      }));
    }
  }, [open, requiredRole, availableTeams, getAvailablePlayersForRole, deployed, slotId, isGoalkeeper]);

  // Set initial value when opening
  useMemo(() => {
    if (open) {
      const current = deployed[slotId];
      if (current) {
        setSelectedValue(isGoalkeeper ? current.team : current.id);
      } else {
        setSelectedValue('');
      }
    }
  }, [open, slotId, deployed, isGoalkeeper]);

  const handleSave = () => {
    if (!selectedValue) {
      removeDeployedSlot(slotId);
      onClose();
      return;
    }
    
    const option = options.find(o => o.value === selectedValue);
    if (option) {
      deployPlayer(slotId, option.playerObj);
    }
    onClose();
  };

  const handleClear = () => {
    removeDeployedSlot(slotId);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Seleziona {isGoalkeeper ? 'Portiere' : 'Giocatore'} ({requiredRole})</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <FormControl fullWidth sx={{ mt: 1 }}>
          <InputLabel>{isGoalkeeper ? 'Squadra (Blocco)' : 'Giocatore Disponibile'}</InputLabel>
          <Select
            value={selectedValue}
            label={isGoalkeeper ? 'Squadra (Blocco)' : 'Giocatore Disponibile'}
            onChange={e => setSelectedValue(e.target.value)}
          >
            <MenuItem value=""><em>Nessuno</em></MenuItem>
            {options.map(opt => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClear} color="error">Rimuovi</Button>
        <Button onClick={onClose} color="inherit">Annulla</Button>
        <Button onClick={handleSave} variant="contained">Salva</Button>
      </DialogActions>
    </Dialog>
  );
}
