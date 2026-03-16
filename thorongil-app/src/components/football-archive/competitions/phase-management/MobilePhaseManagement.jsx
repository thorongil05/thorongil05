import {
    Box, Paper, Stack, Typography, ListItem, ListItemText,
    List, IconButton, Button, Dialog, DialogTitle, DialogContent,
    DialogActions, TextField, MenuItem, Divider, ListItemButton, Chip
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import PropTypes from "prop-types";
import { useState } from "react";
import PhaseDetailView from "./PhaseDetailView";
import { apiPost, apiDelete } from "../../../../utils/api";

function MobilePhaseManagement({ phases, editionId, selectedPhaseId, setSelectedPhaseId, onPhasesUpdate, onPhaseAdded }) {
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [newPhase, setNewPhase] = useState({ name: "", type: "GROUP", orderIndex: phases.length });

    const handleAdd = async () => {
        if (!newPhase.name) return;
        try {
            const result = await apiPost(`/api/competitions/editions/${editionId}/phases`, newPhase);
            setNewPhase({ name: "", type: "GROUP", orderIndex: phases.length + 1 });
            setIsAddDialogOpen(false);
            onPhaseAdded(result.id);
        } catch (err) {
            console.error("Error adding phase:", err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Sei sicuro di voler eliminare questa fase?")) return;
        try {
            await apiDelete(`/api/competitions/phases/${id}`);
            setSelectedPhaseId(null);
            onPhasesUpdate();
        } catch (err) {
            console.error("Error deleting phase:", err);
        }
    };

    const selectedPhase = phases.find(p => p.id === selectedPhaseId);

    // If a phase is selected, show detail view with back button
    if (selectedPhaseId && selectedPhase) {
        return (
            <Box>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => setSelectedPhaseId(null)}
                    sx={{ mb: 2 }}
                >
                    Torna alla lista
                </Button>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                    <PhaseDetailView
                        phase={selectedPhase}
                        onUpdate={onPhasesUpdate}
                        onDelete={() => handleDelete(selectedPhase.id)}
                    />
                </Paper>
            </Box>
        );
    }

    // Otherwise show the list of phases
    return (
        <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Fasi ({phases.length})</Typography>
                <Button
                    startIcon={<AddIcon />}
                    variant="contained"
                    size="small"
                    onClick={() => setIsAddDialogOpen(true)}
                >
                    Aggiungi
                </Button>
            </Stack>

            <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <List disablePadding>
                    {phases.map((phase, index) => (
                        <ListItemButton
                            key={phase.id}
                            divider={index !== phases.length - 1}
                            onClick={() => setSelectedPhaseId(phase.id)}
                            sx={{ py: 2 }}
                        >
                            <ListItemText
                                primary={phase.name}
                                secondary={
                                    <Chip
                                        label={phase.type === 'GROUP' ? 'Gironi' : 'Eliminazione'}
                                        size="small"
                                        sx={{ mt: 0.5, height: 20, fontSize: '0.6rem' }}
                                        color={phase.type === 'GROUP' ? 'info' : 'secondary'}
                                        variant="outlined"
                                    />
                                }
                                primaryTypographyProps={{ fontWeight: 'bold' }}
                            />
                        </ListItemButton>
                    ))}
                    {phases.length === 0 && (
                        <Box sx={{ p: 4, textAlign: 'center' }}>
                            <Typography variant="body2" color="text.secondary">Nessuna fase configurata.</Typography>
                        </Box>
                    )}
                </List>
            </Paper>

            <Dialog open={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)} fullWidth>
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    Nuova Fase
                    <IconButton size="small" onClick={() => setIsAddDialogOpen(false)}><CloseIcon /></IconButton>
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={3} sx={{ mt: 1 }}>
                        <TextField
                            label="Nome Fase"
                            fullWidth
                            autoFocus
                            value={newPhase.name}
                            onChange={(e) => setNewPhase({ ...newPhase, name: e.target.value })}
                        />
                        <TextField
                            select
                            label="Tipo"
                            fullWidth
                            value={newPhase.type}
                            onChange={(e) => setNewPhase({ ...newPhase, type: e.target.value })}
                        >
                            <MenuItem value="GROUP">Gironi (GROUP)</MenuItem>
                            <MenuItem value="KNOCKOUT">Eliminazione Diretta (KNOCKOUT)</MenuItem>
                        </TextField>
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setIsAddDialogOpen(false)}>Annulla</Button>
                    <Button variant="contained" onClick={handleAdd}>Crea Fase</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

MobilePhaseManagement.propTypes = {
    phases: PropTypes.array.isRequired,
    editionId: PropTypes.number.isRequired,
    selectedPhaseId: PropTypes.number,
    setSelectedPhaseId: PropTypes.func.isRequired,
    onPhasesUpdate: PropTypes.func.isRequired,
    onPhaseAdded: PropTypes.func.isRequired
};

export default MobilePhaseManagement;
