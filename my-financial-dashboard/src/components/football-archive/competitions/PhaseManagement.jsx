import {
    Box, Typography, Button, Stack, Paper, IconButton,
    TextField, MenuItem, Collapse, Divider, List, ListItem, ListItemText, ListItemSecondaryAction
} from "@mui/material";
import { useState, useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { apiGet, apiPost, apiDelete, apiPut } from "../../../utils/api";
import PropTypes from "prop-types";

function PhaseManagement({ editionId }) {
    const [phases, setPhases] = useState([]);
    const [loading, setLoading] = useState(false);
    const [expandedPhaseId, setExpandedPhaseId] = useState(null);
    const [isAddingPhase, setIsAddingPhase] = useState(false);
    const [newPhase, setNewPhase] = useState({ name: "", type: "GROUP", orderIndex: 0 });

    const fetchPhases = () => {
        if (!editionId) return;
        setLoading(true);
        apiGet(`/api/competitions/editions/${editionId}/phases`)
            .then(data => {
                setPhases(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching phases:", err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchPhases();
    }, [editionId]);

    const handleAddPhase = async () => {
        if (!newPhase.name) return;
        try {
            await apiPost(`/api/competitions/editions/${editionId}/phases`, newPhase);
            setNewPhase({ name: "", type: "GROUP", orderIndex: phases.length });
            setIsAddingPhase(false);
            fetchPhases();
        } catch (err) {
            console.error("Error adding phase:", err);
        }
    };

    const handleDeletePhase = async (id) => {
        if (!window.confirm("Sei sicuro di voler eliminare questa fase?")) return;
        try {
            await apiDelete(`/api/competitions/phases/${id}`);
            fetchPhases();
        } catch (err) {
            console.error("Error deleting phase:", err);
        }
    };

    return (
        <Box sx={{ mt: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="h6">Fasi e Gironi</Typography>
                <Button
                    startIcon={<AddIcon />}
                    variant="contained"
                    size="small"
                    onClick={() => setIsAddingPhase(true)}
                >
                    Aggiungi Fase
                </Button>
            </Stack>

            {isAddingPhase && (
                <Paper sx={{ p: 2, mb: 2, border: '1px solid', borderColor: 'primary.main' }}>
                    <Typography variant="subtitle2" sx={{ mb: 2 }}>Nuova Fase</Typography>
                    <Stack spacing={2}>
                        <TextField
                            label="Nome Fase"
                            size="small"
                            fullWidth
                            value={newPhase.name}
                            onChange={(e) => setNewPhase({ ...newPhase, name: e.target.value })}
                        />
                        <TextField
                            select
                            label="Tipo"
                            size="small"
                            fullWidth
                            value={newPhase.type}
                            onChange={(e) => setNewPhase({ ...newPhase, type: e.target.value })}
                        >
                            <MenuItem value="GROUP">Gironi (GROUP)</MenuItem>
                            <MenuItem value="KNOCKOUT">Eliminazione Diretta (KNOCKOUT)</MenuItem>
                        </TextField>
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                            <Button size="small" onClick={() => setIsAddingPhase(false)}>Annulla</Button>
                            <Button size="small" variant="contained" onClick={handleAddPhase}>Salva</Button>
                        </Stack>
                    </Stack>
                </Paper>
            )}

            <Stack spacing={2}>
                {phases.map(phase => (
                    <PhaseItem
                        key={phase.id}
                        phase={phase}
                        onDelete={() => handleDeletePhase(phase.id)}
                        isExpanded={expandedPhaseId === phase.id}
                        onToggle={() => setExpandedPhaseId(expandedPhaseId === phase.id ? null : phase.id)}
                    />
                ))}
                {phases.length === 0 && !loading && (
                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                        Nessuna fase configurata per questa edizione. Tutte le partite saranno libere.
                    </Typography>
                )}
            </Stack>
        </Box>
    );
}

function PhaseItem({ phase, onDelete, isExpanded, onToggle }) {
    const [groups, setGroups] = useState([]);
    const [isAddingGroup, setIsAddingGroup] = useState(false);
    const [groupName, setGroupName] = useState("");

    const fetchGroups = () => {
        apiGet(`/api/competitions/phases/${phase.id}/groups`)
            .then(data => setGroups(data))
            .catch(err => console.error("Error fetching groups:", err));
    };

    useEffect(() => {
        if (isExpanded && phase.type === 'GROUP') {
            fetchGroups();
        }
    }, [isExpanded, phase.id, phase.type]);

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
        try {
            await apiDelete(`/api/competitions/groups/${groupId}`);
            fetchGroups();
        } catch (err) {
            console.error("Error deleting group:", err);
        }
    };

    return (
        <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: isExpanded ? 'action.hover' : 'inherit' }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                    <IconButton size="small" onClick={onToggle}>
                        {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                    <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                            {phase.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {phase.type === 'GROUP' ? 'Gironi' : 'Eliminazione Diretta'}
                        </Typography>
                    </Box>
                </Stack>
                <Stack direction="row" spacing={1}>
                    <IconButton size="small" color="error" onClick={onDelete}>
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Stack>
            </Box>

            <Collapse in={isExpanded}>
                <Divider />
                <Box sx={{ p: 2, bgcolor: 'background.paper' }}>
                    {phase.type === 'GROUP' ? (
                        <>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                                <Typography variant="caption" sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
                                    Gironi
                                </Typography>
                                {!isAddingGroup && (
                                    <Button size="small" startIcon={<AddIcon />} onClick={() => setIsAddingGroup(true)}>
                                        Aggiungi Girone
                                    </Button>
                                )}
                            </Stack>

                            {isAddingGroup && (
                                <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                                    <TextField
                                        label="Nome Girone"
                                        size="small"
                                        value={groupName}
                                        onChange={(e) => setGroupName(e.target.value)}
                                        sx={{ flex: 1 }}
                                    />
                                    <Button variant="contained" size="small" onClick={handleAddGroup}>Salva</Button>
                                    <Button size="small" onClick={() => setIsAddingGroup(false)}>Annulla</Button>
                                </Stack>
                            )}

                            <List size="small" disablePadding>
                                {groups.map(group => (
                                    <ListItem key={group.id} divider>
                                        <ListItemText primary={group.name} primaryTypographyProps={{ variant: 'body2' }} />
                                        <ListItemSecondaryAction>
                                            <IconButton size="small" edge="end" color="error" onClick={() => handleDeleteGroup(group.id)}>
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                ))}
                                {groups.length === 0 && !isAddingGroup && (
                                    <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                        Nessun girone creato.
                                    </Typography>
                                )}
                            </List>
                        </>
                    ) : (
                        <Typography variant="body2" color="text.secondary">
                            Fase a eliminazione diretta. Gestisci gli incontri nella sezione Partite assegnandoli a questa fase.
                        </Typography>
                    )}
                </Box>
            </Collapse>
        </Paper>
    );
}

PhaseManagement.propTypes = {
    editionId: PropTypes.number
};

PhaseItem.propTypes = {
    phase: PropTypes.object.isRequired,
    onDelete: PropTypes.func.isRequired,
    isExpanded: PropTypes.bool.isRequired,
    onToggle: PropTypes.func.isRequired
};

export default PhaseManagement;
