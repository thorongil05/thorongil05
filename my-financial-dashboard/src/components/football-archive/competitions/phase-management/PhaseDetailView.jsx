import { useState, useEffect } from "react";
import {
    Box, Typography, TextField, MenuItem, Stack, Button,
    Divider, IconButton, List, ListItem, ListItemText,
    ListItemSecondaryAction, Paper, Alert
} from "@mui/material";
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
        setEditingPhase(prev => {
            const updated = { ...prev, [name]: value };

            // Auto-calculate matches if metadata or type changes
            if (name === "type" || name === "name") return updated;

            return updated;
        });
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
        try {
            await apiPut(`/api/competitions/phases/${phase.id}`, editingPhase);
            onUpdate();
        } catch (err) {
            console.error("Error updating phase:", err);
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
            {/* Header with Actions */}
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{phase.name}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                        Configurazione Dettagliata
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon />}
                    onClick={handleSavePhase}
                >
                    Salva Modifiche
                </Button>
            </Stack>

            <GridContainer>
                {/* General Info */}
                <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
                        INFO GENERALI
                    </Typography>
                    <Stack spacing={2}>
                        <TextField
                            label="Nome Fase"
                            size="small"
                            fullWidth
                            value={editingPhase.name}
                            onChange={(e) => handlePhaseChange("name", e.target.value)}
                        />
                        <TextField
                            select
                            label="Tipo"
                            size="small"
                            fullWidth
                            value={editingPhase.type}
                            onChange={(e) => handlePhaseChange("type", e.target.value)}
                        >
                            <MenuItem value="GROUP">Gironi (GROUP)</MenuItem>
                            <MenuItem value="KNOCKOUT">Eliminazione Diretta (KNOCKOUT)</MenuItem>
                        </TextField>
                    </Stack>
                </Box>

                {/* Metadata */}
                <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
                        METADATI E REGOLE
                    </Typography>
                    <Stack spacing={2}>
                        <TextField
                            label="Numero Partecipanti"
                            type="number"
                            size="small"
                            fullWidth
                            value={editingPhase.metadata?.participantsCount ?? ""}
                            onChange={(e) => handleMetadataChange("participantsCount", parseInt(e.target.value))}
                        />
                        <Box>
                            <TextField
                                label="Numero Totale Partite"
                                type="number"
                                size="small"
                                fullWidth
                                value={editingPhase.metadata?.totalMatches ?? ""}
                                onChange={(e) => handleMetadataChange("totalMatches", parseInt(e.target.value))}
                            />
                            {editingPhase.type === "GROUP" && (
                                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block', fontSize: '0.7rem' }}>
                                    Formula calcolo: Partecipanti * 2 - 2
                                </Typography>
                            )}
                        </Box>
                    </Stack>
                </Box>
            </GridContainer>

            <Divider />

            {/* Groups Management */}
            <Box>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                        GESTIONE GIRONI
                    </Typography>
                    {phase.type === 'GROUP' && !isAddingGroup && (
                        <Button
                            size="small"
                            startIcon={<AddIcon />}
                            onClick={() => setIsAddingGroup(true)}
                            variant="outlined"
                        >
                            Nuovo Girone
                        </Button>
                    )}
                </Stack>

                {phase.type !== 'GROUP' ? (
                    <Alert severity="info" sx={{ borderRadius: 2 }}>
                        Questa fase non prevede gironi. Le partite verranno gestite come eliminazione diretta.
                    </Alert>
                ) : (
                    <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
                        {isAddingGroup && (
                            <Box sx={{ p: 2, bgcolor: 'action.hover', borderBottom: '1px solid', borderColor: 'divider' }}>
                                <Stack direction="row" spacing={1}>
                                    <TextField
                                        label="Nome Girone"
                                        size="small"
                                        autoFocus
                                        value={groupName}
                                        onChange={(e) => setGroupName(e.target.value)}
                                        sx={{ flex: 1 }}
                                    />
                                    <Button variant="contained" size="small" onClick={handleAddGroup}>Aggiungi</Button>
                                    <Button size="small" onClick={() => setIsAddingGroup(false)}>Annulla</Button>
                                </Stack>
                            </Box>
                        )}

                        <List disablePadding>
                            {groups.map((group, index) => (
                                <ListItem
                                    key={group.id}
                                    divider={index !== groups.length - 1}
                                    sx={{ '&:hover': { bgcolor: 'action.hover' } }}
                                >
                                    {editingGroup?.id === group.id ? (
                                        <Stack direction="row" spacing={1} sx={{ width: '100%', py: 0.5 }}>
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
                                            <ListItemText
                                                primary={group.name}
                                                primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                                            />
                                            <ListItemSecondaryAction>
                                                <IconButton size="small" onClick={() => setEditingGroup({ ...group })}>
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                                <IconButton size="small" color="error" onClick={() => handleDeleteGroup(group.id)}>
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </ListItemSecondaryAction>
                                        </>
                                    )}
                                </ListItem>
                            ))}
                            {groups.length === 0 && !isAddingGroup && (
                                <Box sx={{ p: 4, textAlign: 'center' }}>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                        Nessun girone configurato. Clicca su "Nuovo Girone" per iniziare.
                                    </Typography>
                                </Box>
                            )}
                        </List>
                    </Paper>
                )}
            </Box>

            <Divider />

            {/* Danger Zone */}
            <Box sx={{ pt: 2 }}>
                <Button
                    variant="text"
                    color="error"
                    size="small"
                    startIcon={<DeleteIcon />}
                    onClick={onDelete}
                >
                    Elimina intera fase
                </Button>
            </Box>
        </Stack>
    );
}

// Simple internal component for layout
function GridContainer({ children }) {
    return (
        <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: 4
        }}>
            {children}
        </Box>
    );
}

PhaseDetailView.propTypes = {
    phase: PropTypes.object,
    onUpdate: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired
};

export default PhaseDetailView;
