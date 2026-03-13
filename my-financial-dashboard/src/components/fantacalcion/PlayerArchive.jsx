import { useState } from 'react';
import { useFantacalcion, ROLES, SERIE_A_TEAMS } from './context/FantacalcionContext';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, TextField, Select, MenuItem, FormControl, InputLabel, IconButton, Box, Typography
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

export default function PlayerArchive() {
  const { players, addPlayerToArchive, removePlayerFromArchive, updatePlayerInArchive } = useFantacalcion();
  const [filterName, setFilterName] = useState('');
  const [filterRole, setFilterRole] = useState('');
  
  const [formName, setFormName] = useState('');
  const [formRole, setFormRole] = useState('DIF');
  const [formTeam, setFormTeam] = useState(SERIE_A_TEAMS[0]);
  const [editingId, setEditingId] = useState(null);

  const filteredPlayers = players.filter(p => {
    if (filterName && !p.name.toLowerCase().includes(filterName.toLowerCase())) return false;
    if (filterRole && p.role !== filterRole) return false;
    return true;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formName.trim()) return;
    
    // Validate if it's a Goalkeeper, enforce team block logic visually
    const finalName = formRole === 'POR' ? `${formTeam} (Blocco)` : formName;

    if (editingId) {
      updatePlayerInArchive({ id: editingId, name: finalName, role: formRole, team: formTeam });
      setEditingId(null);
    } else {
      addPlayerToArchive({ name: finalName, role: formRole, team: formTeam });
    }
    setFormName('');
  };

  const startEdit = (p) => {
    setEditingId(p.id);
    setFormName(p.name);
    setFormRole(p.role);
    setFormTeam(p.team);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" mb={3}>Archivio Giocatori</Typography>
      
      {/* Add / Edit Form */}
      <Paper sx={{ p: 2, mb: 3 }} elevation={2}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <TextField 
            label="Nome Giocatore" 
            value={formName} 
            onChange={(e) => setFormName(e.target.value)}
            disabled={editingId === null && formRole === 'POR'}
            helperText={formRole === 'POR' ? "Verrà salvato come blocco squadra" : ""}
            size="small"
            required={formRole !== 'POR'}
          />
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Ruolo</InputLabel>
            <Select value={formRole} label="Ruolo" onChange={(e) => setFormRole(e.target.value)}>
              {ROLES.map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Squadra</InputLabel>
            <Select value={formTeam} label="Squadra" onChange={(e) => setFormTeam(e.target.value)}>
              {SERIE_A_TEAMS.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
            </Select>
          </FormControl>
          
          <Button type="submit" variant="contained">
            {editingId ? 'Aggiorna' : 'Aggiungi'}
          </Button>
          {editingId && (
            <Button variant="outlined" onClick={() => { setEditingId(null); setFormName(''); }}>Annulla</Button>
          )}
        </form>
      </Paper>

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField 
          label="Cerca per nome" 
          variant="outlined" 
          size="small" 
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
        />
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Filtra Ruolo</InputLabel>
          <Select value={filterRole} label="Filtra Ruolo" onChange={(e) => setFilterRole(e.target.value)}>
            <MenuItem value="">Tutti</MenuItem>
            {ROLES.map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
          </Select>
        </FormControl>
      </Box>

      {/* Table */}
      <TableContainer component={Paper} elevation={2}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Ruolo</TableCell>
              <TableCell>Squadra</TableCell>
              <TableCell align="right">Azioni</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPlayers.map((player) => (
              <TableRow key={player.id}>
                <TableCell>{player.name}</TableCell>
                <TableCell>{player.role}</TableCell>
                <TableCell>{player.team}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => startEdit(player)} size="small" color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => removePlayerFromArchive(player.id)} size="small" color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {filteredPlayers.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">Nessun giocatore trovato</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
