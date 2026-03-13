import { useState, useEffect, useMemo } from 'react';
import { useFantacalcion, ROLES } from './context/FantacalcionContext';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, TextField, Select, MenuItem, FormControl, InputLabel, IconButton, Box, Typography,
  TablePagination, Snackbar
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

export default function PlayerArchive() {
  const { players, teams, addPlayerToArchive, removePlayerFromArchive, updatePlayerInArchive, addTeamToArchive, loading } = useFantacalcion();
  
  // Filtering states
  const [filterName, setFilterName] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterTeam, setFilterTeam] = useState('');
  
  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Form states
  const [formName, setFormName] = useState('');
  const [formRole, setFormRole] = useState('DIF');
  const [formTeam, setFormTeam] = useState('');
  const [editingId, setEditingId] = useState(null);

  // Snackbar state
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  const [newTeamName, setNewTeamName] = useState('');

  // Handle initialization of formTeam once teams are loaded
  useEffect(() => {
    if (teams.length > 0 && !formTeam) {
      setFormTeam(teams[0].name);
    }
  }, [teams, formTeam]);

  // Derived: Filtered players
  const filteredPlayers = useMemo(() => {
    return players.filter(p => {
      if (filterName && !p.name.toLowerCase().includes(filterName.toLowerCase())) return false;
      if (filterRole && p.role !== filterRole) return false;
      if (filterTeam && p.team_name !== filterTeam) return false;
      return true;
    });
  }, [players, filterName, filterRole, filterTeam]);

  // Handle pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const showMessage = (message) => {
    setSnackbar({ open: true, message });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // For POR, name is auto-generated, for others it's required
    if (formRole !== 'POR' && !formName.trim()) return;
    
    // Validate if it's a Goalkeeper, enforce team block logic visually
    const finalName = formRole === 'POR' ? `${formTeam} (Blocco)` : formName;

    try {
      if (editingId) {
        await updatePlayerInArchive({ id: editingId, name: finalName, role: formRole, team: formTeam });
        showMessage('Giocatore aggiornato con successo');
        setEditingId(null);
      } else {
        await addPlayerToArchive({ name: finalName, role: formRole, team: formTeam });
        showMessage('Giocatore aggiunto con successo');
      }
      setFormName('');
    } catch (err) {
      showMessage(`Errore: ${err.message}`);
    }
  };

  const startEdit = (p) => {
    setEditingId(p.id);
    setFormName(p.name);
    setFormRole(p.role);
    setFormTeam(p.team_name);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    try {
      await removePlayerFromArchive(id);
      showMessage('Giocatore rimosso');
    } catch (err) {
      showMessage(`Errore: ${err.message}`);
    }
  };

  const handleAddTeam = async (e) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;
    try {
      await addTeamToArchive(newTeamName);
      showMessage('Squadra aggiunta con successo');
      setNewTeamName('');
    } catch (err) {
      showMessage(`Errore: ${err.message}`);
    }
  };

  if (loading) return <Box sx={{ p: 3 }}><Typography>Caricamento...</Typography></Box>;

  // Players to show on current page
  const paginatedPlayers = filteredPlayers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box sx={{ p: 3, maxWidth: '1200px', margin: '0 auto' }}>
      <Typography variant="h5" mb={3} fontWeight="bold">Archivio Giocatori</Typography>
      
      {/* Add / Edit Form */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }} elevation={3}>
        <Typography variant="subtitle2" mb={2} color="textSecondary">
          {editingId ? 'MODIFICA GIOCATORE' : 'AGGIUNGI NUOVO GIOCATORE'}
        </Typography>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <TextField 
            label="Nome Giocatore" 
            value={formName} 
            sx={{ flexGrow: 2, minWidth: '250px' }}
            onChange={(e) => setFormName(e.target.value)}
            disabled={formRole === 'POR'}
            placeholder={formRole === 'POR' ? "Verrà generato automaticamente" : "Es. Lautaro Martinez"}
            helperText={formRole === 'POR' ? "I portieri vengono salvati come blocco squadra" : ""}
            size="small"
          />
          <FormControl size="small" sx={{ minWidth: 120, flexGrow: 1 }}>
            <InputLabel>Ruolo</InputLabel>
            <Select value={formRole} label="Ruolo" onChange={(e) => {
              setFormRole(e.target.value);
              if (e.target.value === 'POR') setFormName('');
            }}>
              {ROLES.map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 180, flexGrow: 1 }}>
            <InputLabel>Squadra</InputLabel>
            <Select value={formTeam} label="Squadra" onChange={(e) => setFormTeam(e.target.value)}>
              {teams.map(t => <MenuItem key={t.id} value={t.name}>{t.name}</MenuItem>)}
            </Select>
          </FormControl>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button type="submit" variant="contained" sx={{ height: 40, px: 3 }}>
              {editingId ? 'Aggiorna' : 'Aggiungi'}
            </Button>
            {editingId && (
              <Button variant="outlined" sx={{ height: 40 }} onClick={() => { setEditingId(null); setFormName(''); }}>
                Annulla
              </Button>
            )}
          </Box>
        </form>
      </Paper>

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <Typography variant="body2" color="textSecondary" sx={{ mr: 1, fontWeight: 'bold' }}>FILTRI:</Typography>
        <TextField 
          label="Cerca per nome" 
          variant="outlined" 
          size="small" 
          sx={{ flexGrow: 1, minWidth: '200px' }}
          value={filterName}
          onChange={(e) => { setFilterName(e.target.value); setPage(0); }}
        />
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Tutti i Ruoli</InputLabel>
          <Select value={filterRole} label="Tutti i Ruoli" onChange={(e) => { setFilterRole(e.target.value); setPage(0); }}>
            <MenuItem value="">Tutti</MenuItem>
            {ROLES.map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Tutte le Squadre</InputLabel>
          <Select value={filterTeam} label="Tutte le Squadre" onChange={(e) => { setFilterTeam(e.target.value); setPage(0); }}>
            <MenuItem value="">Tutte le Squadre</MenuItem>
            {teams.map(t => <MenuItem key={t.id} value={t.name}>{t.name}</MenuItem>)}
          </Select>
        </FormControl>
        {(filterName || filterRole || filterTeam) && (
          <Button size="small" onClick={() => { setFilterName(''); setFilterRole(''); setFilterTeam(''); setPage(0); }}>
            Resetta
          </Button>
        )}
      </Box>

      {/* Table Section */}
      <TableContainer component={Paper} elevation={1} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Table size="small">
          <TableHead sx={{ bgcolor: 'action.hover' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Nome</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Ruolo</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Squadra</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>Azioni</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedPlayers.map((player) => (
              <TableRow key={player.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell>{player.name}</TableCell>
                <TableCell>{player.role}</TableCell>
                <TableCell>{player.team_name}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => startEdit(player)} size="small" color="primary" title="Modifica">
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(player.id)} size="small" color="error" title="Elimina">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {paginatedPlayers.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                  <Typography color="textSecondary">Nessun giocatore trovato con i filtri attuali</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={filteredPlayers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Righe per pagina:"
        />
      </TableContainer>

      {/* Team Management */}
      <Box sx={{ mt: 6, mb: 4 }}>
        <Typography variant="h6" mb={2} fontWeight="bold">Gestione Squadre</Typography>
        <Paper sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'center', borderRadius: 2 }} elevation={1}>
          <TextField 
            label="Inserisci Nome Squadra" 
            size="small" 
            sx={{ flexGrow: 1 }}
            value={newTeamName} 
            onChange={(e) => setNewTeamName(e.target.value)} 
            onKeyPress={(e) => e.key === 'Enter' && handleAddTeam(e)}
          />
          <Button variant="contained" color="secondary" onClick={handleAddTeam} sx={{ px: 3 }}>
            Aggiungi Squadra
          </Button>
        </Paper>
      </Box>

      {/* Snackbar feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
}
