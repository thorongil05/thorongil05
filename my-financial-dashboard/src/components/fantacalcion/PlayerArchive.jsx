import { useState, useEffect } from 'react';
import { useFantacalcion, ROLES, SERIE_A_TEAMS } from './context/FantacalcionContext';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, TextField, Select, MenuItem, FormControl, InputLabel, IconButton, Box, Typography
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

export default function PlayerArchive() {
  const { players, teams, addPlayerToArchive, removePlayerFromArchive, updatePlayerInArchive, addTeamToArchive, loading } = useFantacalcion();
  const [filterName, setFilterName] = useState('');
  const [filterRole, setFilterRole] = useState('');
  
  const [formName, setFormName] = useState('');
  const [formRole, setFormRole] = useState('DIF');
  const [formTeam, setFormTeam] = useState('');
  const [editingId, setEditingId] = useState(null);

  const [newTeamName, setNewTeamName] = useState('');

  // Handle initialization of formTeam once teams are loaded
  useEffect(() => {
    if (teams.length > 0 && !formTeam) {
      setFormTeam(teams[0].name);
    }
  }, [teams, formTeam]);

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
    setFormTeam(p.team_name);
  };

  const handleAddTeam = async (e) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;
    await addTeamToArchive(newTeamName);
    setNewTeamName('');
  };

  if (loading) return <Box sx={{ p: 3 }}><Typography>Caricamento...</Typography></Box>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" mb={3}>Archivio Giocatori</Typography>
      
      {/* Add / Edit Form */}
      <Paper sx={{ p: 2, mb: 3 }} elevation={2}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <TextField 
            label="Nome Giocatore" 
            value={formName} 
            sx={{ flexGrow: 1, minWidth: '200px' }}
            onChange={(e) => setFormName(e.target.value)}
            disabled={editingId === null && formRole === 'POR'}
            helperText={formRole === 'POR' ? "Verrà salvato come blocco squadra" : ""}
            size="small"
            required={formRole !== 'POR'}
          />
          <FormControl size="small" sx={{ minWidth: 120, flexGrow: 1 }}>
            <InputLabel>Ruolo</InputLabel>
            <Select value={formRole} label="Ruolo" onChange={(e) => setFormRole(e.target.value)}>
              {ROLES.map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 150, flexGrow: 1 }}>
            <InputLabel>Squadra</InputLabel>
            <Select value={formTeam} label="Squadra" onChange={(e) => setFormTeam(e.target.value)}>
              {teams.map(t => <MenuItem key={t.id} value={t.name}>{t.name}</MenuItem>)}
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
      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
        <TextField 
          label="Cerca per nome" 
          variant="outlined" 
          size="small" 
          sx={{ flexGrow: 1, minWidth: '150px' }}
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
        />
        <FormControl size="small" sx={{ minWidth: 120, flexGrow: 1 }}>
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
                <TableCell>{player.team_name}</TableCell>
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

      {/* Team Management */}
      <Box sx={{ mt: 5 }}>
        <Typography variant="h6" mb={2}>Gestione Squadre</Typography>
        <Paper sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField 
            label="Nuova Squadra" 
            size="small" 
            value={newTeamName} 
            onChange={(e) => setNewTeamName(e.target.value)} 
          />
          <Button variant="outlined" onClick={handleAddTeam}>Aggiungi Squadra</Button>
        </Paper>
      </Box>
    </Box>
  );
}
