import {
    Box, Paper, Stack, Typography, Button, TextField,
    IconButton, Card, CardActionArea, MenuItem, Chip
} from "@mui/material";
import Grid from "@mui/material/Grid";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import PropTypes from "prop-types";
import { useState } from "react";
import PhaseDetailView from "./PhaseDetailView";
import { apiPost, apiDelete } from "../../../../utils/api";

function DesktopPhaseManagement({ phases, editionId, selectedPhaseId, setSelectedPhaseId, onPhasesUpdate, onPhaseAdded }) {
    const [isAdding, setIsAdding] = useState(false);
    const [newPhase, setNewPhase] = useState({ name: "", type: "GROUP", orderIndex: phases.length });

    const handleAdd = async () => {
        if (!newPhase.name) return;
        try {
            const result = await apiPost(`/api/competitions/editions/${editionId}/phases`, newPhase);
            setNewPhase({ name: "", type: "GROUP", orderIndex: phases.length + 1 });
            setIsAdding(false);
            onPhaseAdded(result.id);
        } catch (err) {
            console.error("Error adding phase:", err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Sei sicuro di voler eliminare questa fase?")) return;
        try {
            await apiDelete(`/api/competitions/phases/${id}`);
            if (selectedPhaseId === id) setSelectedPhaseId(null);
            onPhasesUpdate();
        } catch (err) {
            console.error("Error deleting phase:", err);
        }
    };

    const selectedPhase = phases.find(p => p.id === selectedPhaseId);

    return (
        <Grid container spacing={3} sx={{ height: 'calc(100vh - 250px)', minHeight: 600 }}>
            {/* Sidebar (Master) */}
            <Grid size={{ xs: 12, md: 4, lg: 3 }}>
                <Paper
                    variant="outlined"
                    sx={{
                        p: 2,
                        borderRadius: 3,
                        bgcolor: 'action.hover',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        overflowY: 'auto'
                    }}
                >
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>
                            FASI ({phases.length})
                        </Typography>
                        {!isAdding && (
                            <IconButton size="small" color="primary" onClick={() => setIsAdding(true)}>
                                <AddIcon fontSize="small" />
                            </IconButton>
                        )}
                    </Stack>

                    <Stack spacing={1}>
                        {isAdding && (
                            <Paper elevation={0} sx={{ p: 1.5, border: '1px dashed', borderColor: 'primary.main', bgcolor: 'primary.light', bgopacity: 0.1, borderRadius: 2 }}>
                                <Stack spacing={1.5}>
                                    <TextField
                                        size="small"
                                        label="Nome Nuova Fase"
                                        autoFocus
                                        value={newPhase.name}
                                        onChange={(e) => setNewPhase({ ...newPhase, name: e.target.value })}
                                        sx={{ bgcolor: 'background.paper' }}
                                    />
                                    <TextField
                                        select
                                        size="small"
                                        label="Tipo"
                                        value={newPhase.type}
                                        onChange={(e) => setNewPhase({ ...newPhase, type: e.target.value })}
                                        sx={{ bgcolor: 'background.paper' }}
                                    >
                                        <MenuItem value="GROUP">Gironi</MenuItem>
                                        <MenuItem value="KNOCKOUT">Eliminazione</MenuItem>
                                    </TextField>
                                    <Stack direction="row" spacing={1}>
                                        <Button fullWidth size="small" variant="contained" onClick={handleAdd}>Salva</Button>
                                        <Button fullWidth size="small" onClick={() => setIsAdding(false)}>Annulla</Button>
                                    </Stack>
                                </Stack>
                            </Paper>
                        )}

                        {phases.map(phase => (
                            <Card
                                key={phase.id}
                                variant="outlined"
                                sx={{
                                    borderRadius: 2,
                                    borderColor: selectedPhaseId === phase.id ? 'primary.main' : 'divider',
                                    bgcolor: selectedPhaseId === phase.id ? 'primary.light' : 'background.paper',
                                    bgopacity: 0.05,
                                    boxShadow: selectedPhaseId === phase.id ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
                                    transition: 'all 0.2s',
                                    '&:hover': { borderColor: 'primary.light' }
                                }}
                            >
                                <CardActionArea
                                    onClick={() => setSelectedPhaseId(phase.id)}
                                    sx={{ p: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                                >
                                    <Box sx={{ overflow: 'hidden' }}>
                                        <Typography variant="body2" sx={{ fontWeight: 600, noWrap: true }}>
                                            {phase.name}
                                        </Typography>
                                        <Chip
                                            label={phase.type === 'GROUP' ? 'Gironi' : 'Eliminazione'}
                                            size="small"
                                            sx={{ height: 16, fontSize: '0.65rem', mt: 0.5 }}
                                            color={phase.type === 'GROUP' ? 'info' : 'secondary'}
                                            variant="outlined"
                                        />
                                    </Box>
                                </CardActionArea>
                            </Card>
                        ))}
                    </Stack>
                </Paper>
            </Grid>

            {/* Detail View - Flattened: No extra Paper here, detail view may have its own structure */}
            <Grid size={{ xs: 12, md: 8, lg: 9 }}>
                <Box sx={{ height: '100%', overflowY: 'auto', px: 1 }}>
                    <PhaseDetailView
                        phase={selectedPhase}
                        onUpdate={onPhasesUpdate}
                        onDelete={() => handleDelete(selectedPhase.id)}
                    />
                </Box>
            </Grid>
        </Grid>
    );
}

DesktopPhaseManagement.propTypes = {
    phases: PropTypes.array.isRequired,
    editionId: PropTypes.number.isRequired,
    selectedPhaseId: PropTypes.number,
    setSelectedPhaseId: PropTypes.func.isRequired,
    onPhasesUpdate: PropTypes.func.isRequired,
    onPhaseAdded: PropTypes.func.isRequired
};

export default DesktopPhaseManagement;
