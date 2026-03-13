import { useState, useEffect, useMemo, forwardRef } from 'react';
import { useFantacalcion, ROLES } from './context/FantacalcionContext';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, TextField, Select, MenuItem, FormControl, InputLabel, IconButton, Box, Typography,
  TablePagination, Snackbar, useTheme, useMediaQuery, Fab, Dialog, AppBar, Toolbar, Slide, List, ListItem, ListItemButton, ListItemText, Divider, ToggleButton, ToggleButtonGroup
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function PlayerArchive() {
  const { players, teams, addPlayerToArchive, removePlayerFromArchive, updatePlayerInArchive, addTeamToArchive, loading } = useFantacalcion();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Filtering states
  const [filterName, setFilterName] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterTeam, setFilterTeam] = useState('');
  
  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(isMobile ? 5 : 10);
  
  // Form states
  const [formName, setFormName] = useState('');
  const [formRole, setFormRole] = useState('DIF');
  const [formTeam, setFormTeam] = useState('');
  const [editingId, setEditingId] = useState(null);

  // Mobile Dialog state
  const [mobileOpen, setMobileOpen] = useState(false);

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
    if (e) e.preventDefault();
    if (formRole !== 'POR' && !formName.trim()) return;
    
    const finalName = formRole === 'POR' ? `${formTeam} (Blocco)` : formName;

    try {
      if (editingId) {
        await updatePlayerInArchive({ id: editingId, name: finalName, role: formRole, team: formTeam });
        showMessage('Giocatore aggiornato');
        setEditingId(null);
      } else {
        await addPlayerToArchive({ name: finalName, role: formRole, team: formTeam });
        showMessage(`${finalName} aggiunto!`);
      }
      setFormName('');
      // If mobile, focus back to name input after add
      return true; 
    } catch (err) {
      showMessage(`Errore: ${err.message}`);
      return false;
    }
  };

  const startEdit = (p) => {
    setEditingId(p.id);
    setFormName(p.name);
    setFormRole(p.role);
    setFormTeam(p.team_name);
    if (isMobile) {
      setMobileOpen(true);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Rimuovere questo giocatore?')) return;
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
      showMessage('Squadra aggiunta');
      setNewTeamName('');
    } catch (err) {
      showMessage(`Errore: ${err.message}`);
    }
  };

  if (loading) return <Box sx={{ p: 3, textAlign: 'center' }}><Typography>Caricamento...</Typography></Box>;

  const paginatedPlayers = filteredPlayers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box sx={{ p: isMobile ? 1 : 3, maxWidth: '1200px', margin: '0 auto', pb: 10 }}>
      <Typography variant={isMobile ? "h6" : "h5"} mb={3} fontWeight="bold">
        Archivio Giocatori
      </Typography>
      
      {/* Desktop Form (Hidden on Mobile) */}
      {!isMobile && (
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
      )}

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: isMobile ? 1 : 2, mb: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField 
          label="Cerca nome" 
          variant="outlined" 
          size="small" 
          sx={{ flexGrow: 1, minWidth: '150px' }}
          value={filterName}
          onChange={(e) => { setFilterName(e.target.value); setPage(0); }}
        />
        <FormControl size="small" sx={{ minWidth: isMobile ? 100 : 140 }}>
          <InputLabel>Ruolo</InputLabel>
          <Select value={filterRole} label="Ruolo" onChange={(e) => { setFilterRole(e.target.value); setPage(0); }}>
            <MenuItem value="">Tutti</MenuItem>
            {ROLES.map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
          </Select>
        </FormControl>
        {!isMobile && (
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Tutte le Squadre</InputLabel>
            <Select value={filterTeam} label="Tutte le Squadre" onChange={(e) => { setFilterTeam(e.target.value); setPage(0); }}>
              <MenuItem value="">Tutte le Squadre</MenuItem>
              {teams.map(t => <MenuItem key={t.id} value={t.name}>{t.name}</MenuItem>)}
            </Select>
          </FormControl>
        )}
      </Box>

      {/* Table Section */}
      <TableContainer component={Paper} elevation={1} sx={{ borderRadius: 2 }}>
        <Table size="small">
          <TableHead sx={{ bgcolor: 'action.hover' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Nome</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} align={isMobile ? 'right' : 'left'}>{isMobile ? 'Info' : 'Ruolo'}</TableCell>
              {!isMobile && <TableCell sx={{ fontWeight: 'bold' }}>Squadra</TableCell>}
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>Azioni</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedPlayers.map((player) => (
              <TableRow key={player.id} hover>
                <TableCell sx={{ fontSize: isMobile ? '0.85rem' : 'inherit' }}>
                  {player.name}
                  {isMobile && <Typography variant="caption" display="block" color="textSecondary">{player.team_name}</Typography>}
                </TableCell>
                <TableCell align={isMobile ? 'right' : 'left'} sx={{ fontSize: isMobile ? '0.8rem' : 'inherit' }}>
                  {player.role}
                </TableCell>
                {!isMobile && <TableCell>{player.team_name}</TableCell>}
                <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                  <IconButton onClick={() => startEdit(player)} size="small" color="primary">
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(player.id)} size="small" color="error">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredPlayers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage={isMobile ? "Righe:" : "Righe per pagina:"}
        />
      </TableContainer>

      {/* Team Management */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="subtitle1" mb={2} fontWeight="bold">Gestione Squadre</Typography>
        <Paper sx={{ p: 2, display: 'flex', gap: 1, alignItems: 'center', borderRadius: 2 }} elevation={1}>
          <TextField label="Nuova Squadra" size="small" sx={{ flexGrow: 1 }}
            value={newTeamName} onChange={(e) => setNewTeamName(e.target.value)} 
          />
          <Button variant="outlined" color="secondary" onClick={handleAddTeam} size="small">Add</Button>
        </Paper>
      </Box>

      {/* Mobile Floating Action Button */}
      {isMobile && (
        <Fab 
          color="primary" 
          aria-label="add" 
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          onClick={() => { setEditingId(null); setFormName(''); setMobileOpen(true); }}
        >
          <AddIcon />
        </Fab>
      )}

      {/* Mobile Quick Add Dialog */}
      <Dialog
        fullScreen
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={() => setMobileOpen(false)} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              {editingId ? 'Modifica Giocatore' : 'Inserimento Rapido'}
            </Typography>
            <Button autoFocus color="inherit" onClick={async () => {
              const success = await handleSubmit();
              if (success && !editingId) {
                // Keep open for next player
              } else if (success) {
                setMobileOpen(false);
              }
            }}>
              Salva
            </Button>
          </Toolbar>
        </AppBar>
        
        <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box>
            <Typography variant="overline" color="textSecondary">RUOLO</Typography>
            <ToggleButtonGroup
              value={formRole}
              exclusive
              onChange={(e, val) => { if (val) { setFormRole(val); if (val === 'POR') setFormName(''); } }}
              fullWidth
              color="primary"
              size="large"
            >
              {ROLES.map(r => <ToggleButton key={r} value={r}>{r}</ToggleButton>)}
            </ToggleButtonGroup>
          </Box>

          <Box>
            <Typography variant="overline" color="textSecondary">NOME GIOCATORE</Typography>
            <TextField 
              fullWidth 
              value={formName} 
              onChange={(e) => setFormName(e.target.value)}
              disabled={formRole === 'POR'}
              placeholder={formRole === 'POR' ? "Generato automaticamente" : "Inserisci Nome"}
              autoFocus
            />
          </Box>

          <Box sx={{ flexGrow: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="overline" color="textSecondary">SQUADRA</Typography>
            <Paper elevation={0} variant="outlined" sx={{ flexGrow: 1, overflowY: 'auto', maxHeight: '40vh', borderRadius: 2 }}>
              <List sx={{ p: 0 }}>
                {teams.map((t) => (
                  <ListItem key={t.id} disablePadding>
                    <ListItemButton 
                      selected={formTeam === t.name}
                      onClick={() => setFormTeam(t.name)}
                    >
                      <ListItemText primary={t.name} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Box>

          <Button 
            variant="contained" 
            size="large" 
            fullWidth 
            sx={{ py: 2, borderRadius: 2 }}
            onClick={async () => {
              const success = await handleSubmit();
              if (success && !editingId) {
                 // Reset name but keep team for quick entry
              } else if (success) {
                setMobileOpen(false);
              }
            }}
          >
            {editingId ? 'AGGIORENA' : 'AGGIUNGI E CONTINUA'}
          </Button>
        </Box>
      </Dialog>

      {/* Snackbar feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
}
