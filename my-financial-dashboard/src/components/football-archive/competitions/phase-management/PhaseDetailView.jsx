import { useState, useEffect } from "react";
import {
    Box, Paper, Stack, Typography, Button, TextField,
    IconButton, Card, CardActionArea, MenuItem, Chip, Divider, Alert
} from "@mui/material";
import Grid from "@mui/material/Grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import { apiGet, apiPost, apiDelete, apiPut } from "../../../../utils/api";
import PropTypes from "prop-types";

function PhaseDetailView({ phase, onUpdate, onDelete }) {
    const [editingPhase, setEditingPhase] = useState(null);
    const [groups, setGroups] = useState([]);
    const [isAddingGroup, setIsAddingGroup] = useState(false);
    const [groupName, setGroupName] = useState("");
    const [editingGroup, setEditingGroup] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (phase) {
            setEditingPhase({ ...phase });
            if (phase.type === 'GROUP') {
                fetchGroups();
            } else {
                setGroups([]);
            }
        }
    }, [phase]);

    const fetchGroups = () => {
        apiGet(`/api/competitions/phases/${phase.id}/groups`)
            .then(setGroups)
            .catch(err => console.error("Error fetching groups:", err));
    };

    const handlePhaseChange = (name, value) => {
        setEditingPhase(prev => ({ ...prev, [name]: value }));
    };

    const handleMetadataChange = (name, value) => {
        setEditingPhase(prev => {
            const newMetadata = { ...(prev.metadata || {}), [name]: value };
            if (name === "participantsCount" && prev.type === "GROUP") {
                const count = parseInt(value);
                if (!isNaN(count)) {
                    newMetadata.totalMatches = Math.max(0, count * 2 - 2);
                }
            }
            return { ...prev, metadata: newMetadata };
        });
    };

    const handleSavePhase = async () => {
        setIsSaving(true);
        try {
            await apiPut(`/api/competitions/phases/${phase.id}`, editingPhase);
            onUpdate();
        } catch (err) {
            console.error("Error updating phase:", err);
        } finally {
            setIsSaving(false);
        }
    };

    const handleAddGroup = async () => {
        if (!groupName) return;
        try {
            await apiPost(`/api/competitions/phases/${phase.id}/groups`, { name: groupName });
            setGroupName("");
            setIsAddingGroup(false);
            fetchGroups();
        } catch (err) {
            console.error("Error adding group:", err);
        }
    };

    const handleDeleteGroup = async (groupId) => {
        if (!window.confirm("Eliminare questo girone?")) return;
        try {
            await apiDelete(`/api/competitions/groups/${groupId}`);
            fetchGroups();
        } catch (err) {
            console.error("Error deleting group:", err);
        }
    };

    const handleUpdateGroup = async () => {
        if (!editingGroup || !editingGroup.name) return;
        try {
            await apiPut(`/api/competitions/groups/${editingGroup.id}`, { name: editingGroup.name });
            setEditingGroup(null);
            fetchGroups();
        } catch (err) {
            console.error("Error updating group:", err);
        }
    };

    if (!phase || !editingPhase) {
        return (
            <Box sx={{ p: 4, textAlign: 'center', bgcolor: 'action.hover', borderRadius: 2 }}>
                <Typography color="text.secondary">Seleziona una fase per gestirne i dettagli</Typography>
            </Box>
        );
    }

    return (
        <Stack spacing={4}>
            {/* Header Area */}
            <Box>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Chip label="DETTAGLIO FASE" size="small" variant="outlined" sx={{ color: 'primary.main', fontWeight: 'bold', fontSize: '0.65rem' }} />
                        <Typography variant="h5" sx={{ fontWeight: 800 }}>{phase.name}</Typography>
                    </Stack>
                    <Button
                        variant="contained"
                        startIcon={<SaveIcon />}
                        onClick={handleSavePhase}
                        disabled={isSaving}
                        sx={{ borderRadius: 2, px: 3 }}
                    >
                        {isSaving ? "Salvataggio..." : "Salva Dettagli"}
                    </Button>
                </Stack>
                <Typography variant="body2" color="text.secondary">
                    Configura i parametri tecnici, i partecipanti e la struttura dei gironi per questa fase.
                </Typography>
            </Box>

            <Divider />

            {/* Config Sections */}
            <Grid container spacing={4}>
                {/* Basic Configuration */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700, color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 1 }}>
                        CONFIGURAZIONE BASE
                    </Typography>
                    <Stack spacing={2.5}>
                        <TextField
                            label="Nome Visualizzato"
                            fullWidth
                            value={editingPhase.name}
                            onChange={(e) => handlePhaseChange("name", e.target.value)}
                        />
                        <TextField
                            select
                            label="Modello di competizione"
                            fullWidth
                            value={editingPhase.type}
                            onChange={(e) => handlePhaseChange("type", e.target.value)}
                            helperText="Definisce se la fase ha gironi all'italiana o scontri diretti."
                        >
                            <MenuItem value="GROUP">Gironi (Campionato/Round Robin)</MenuItem>
                            <MenuItem value="KNOCKOUT">Eliminazione Diretta (Playoff)</MenuItem>
                        </TextField>
                    </Stack>
                </Grid>

                {/* Technical Parameters */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700, color: 'text.secondary' }}>
                        PARAMETRI TECNICI
                    </Typography>
                    <Stack spacing={2.5}>
                        <TextField
                            label="Posti Disponibili (Partecipanti)"
                            type="number"
                            fullWidth
                            value={editingPhase.metadata?.participantsCount ?? ""}
                            onChange={(e) => handleMetadataChange("participantsCount", parseInt(e.target.value))}
                        />
                        <TextField
                            label="Partite Totali Previste"
                            type="number"
                            fullWidth
                            value={editingPhase.metadata?.totalMatches ?? ""}
                            onChange={(e) => handleMetadataChange("totalMatches", parseInt(e.target.value))}
                            helperText={editingPhase.type === "GROUP" ? "Formula calcolata: Partecipanti * 2 - 2" : "Inserisci manualmente il numero di partite."}
                        />
                    </Stack>
                </Grid>
            </Grid>

            {/* Groups Section - Integrated Look */}
            <Box sx={{ mt: 2 }}>
                <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, borderStyle: 'dashed', bgcolor: 'background.default' }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>Struttura Gironi</Typography>
                            <Typography variant="caption" color="text.secondary">Definisci i raggruppamenti per questa fase.</Typography>
                        </Box>
                        {phase.type === 'GROUP' && (
                            <Button
                                startIcon={<AddIcon />}
                                onClick={() => setIsAddingGroup(true)}
                                variant="outlined"
                                size="small"
                                sx={{ borderRadius: 1.5 }}
                                disabled={isAddingGroup}
                            >
                                Aggiungi Girone
                            </Button>
                        )}
                    </Stack>

                    {phase.type !== 'GROUP' ? (
                        <Alert severity="info" variant="outlined" sx={{ borderRadius: 2 }}>
                            Questa fase è di tipo <strong>Eliminazione Diretta</strong>. Non sono previsti gironi; gli accoppiamenti verranno generati automaticamente in base al tabellone.
                        </Alert>
                    ) : (
                        <Stack spacing={1.5}>
                            {isAddingGroup && (
                                <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'primary.main', bgcolor: 'primary.light', bgopacity: 0.05, borderRadius: 2 }}>
                                    <Stack direction="row" spacing={1.5}>
                                        <TextField
                                            label="Nome Nuova Sezione"
                                            size="small"
                                            autoFocus
                                            value={groupName}
                                            onChange={(e) => setGroupName(e.target.value)}
                                            fullWidth
                                            placeholder="E.g. Gruppo A"
                                            sx={{ bgcolor: 'background.paper' }}
                                        />
                                        <Button variant="contained" onClick={handleAddGroup}>Conferma</Button>
                                        <Button onClick={() => setIsAddingGroup(false)}>Annulla</Button>
                                    </Stack>
                                </Paper>
                            )}

                            {groups.map((group) => (
                                <Paper
                                    key={group.id}
                                    elevation={0}
                                    sx={{
                                        p: 1.5,
                                        pl: 2.5,
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        borderRadius: 2,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        bgcolor: 'background.paper',
                                        '&:hover': { borderColor: 'primary.main', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }
                                    }}
                                >
                                    {editingGroup?.id === group.id ? (
                                        <Stack direction="row" spacing={1} sx={{ width: '100%' }}>
                                            <TextField
                                                size="small"
                                                fullWidth
                                                autoFocus
                                                value={editingGroup.name}
                                                onChange={(e) => setEditingGroup({ ...editingGroup, name: e.target.value })}
                                            />
                                            <IconButton color="primary" onClick={handleUpdateGroup}><SaveIcon fontSize="small" /></IconButton>
                                            <IconButton onClick={() => setEditingGroup(null)}><DeleteIcon fontSize="small" /></IconButton>
                                        </Stack>
                                    ) : (
                                        <>
                                            <Typography variant="body1" sx={{ fontWeight: 600 }}>{group.name}</Typography>
                                            <Stack direction="row">
                                                <IconButton size="small" onClick={() => setEditingGroup({ ...group })}>
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                                <IconButton size="small" color="error" onClick={() => handleDeleteGroup(group.id)}>
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Stack>
                                        </>
                                    )}
                                </Paper>
                            ))}

                            {groups.length === 0 && !isAddingGroup && (
                                <Box sx={{ py: 3, textAlign: 'center', bgcolor: 'action.hover', borderRadius: 2, border: '1px dashed', borderColor: 'divider' }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Nessun girone definito. Clicca su "Aggiungi Girone" per creare il primo gruppo.
                                    </Typography>
                                </Box>
                            )}
                        </Stack>
                    )}
                </Paper>
            </Box>

            <Box sx={{ pt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                    variant="text"
                    color="error"
                    size="small"
                    startIcon={<DeleteIcon />}
                    onClick={onDelete}
                    sx={{ opacity: 0.7, '&:hover': { opacity: 1 } }}
                >
                    Elimina Permanentemente questa Fase
                </Button>
            </Box>
        </Stack>
    );
}

PhaseDetailView.propTypes = {
    phase: PropTypes.object,
    onUpdate: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired
};

export default PhaseDetailView;
