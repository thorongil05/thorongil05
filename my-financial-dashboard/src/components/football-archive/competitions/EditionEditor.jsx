import { useState, useEffect } from "react";
import {
    Stack, TextField, Button, Typography, Box, Paper, Divider,
    FormControl, InputLabel, Select, MenuItem, Grid, Chip,
    Alert, IconButton, Card, CardActionArea
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import PropTypes from "prop-types";
import { apiGet, apiPost, apiDelete, apiPut } from "../../../utils/api";
import PhaseManagement from "./phase-management/PhaseManagement";

function EditionEditor({ editionId, onUpdate, onDelete }) {
    const [edition, setEdition] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (editionId) {
            setLoading(true);
            setEdition(null); // Clear previous data while loading new one
            apiGet(`/api/competitions/editions/${editionId}`)
                .then(data => {
                    setEdition(data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Error fetching edition details:", err);
                    setLoading(false);
                });
        }
    }, [editionId]);

    const handleFieldChange = (name, value) => {
        setEdition(prev => ({ ...prev, [name]: value }));
    };

    const handleMetadataChange = (name, value) => {
        setEdition(prev => ({
            ...prev,
            metadata: { ...(prev.metadata || {}), [name]: value }
        }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await apiPut(`/api/competitions/editions/${editionId}`, edition);
            onUpdate();
        } catch (err) {
            console.error("Error saving edition:", err);
        } finally {
            setIsSaving(false);
        }
    };

    if (loading && !edition) return <Typography>Caricamento...</Typography>;
    if (!edition) return <Alert severity="info" sx={{ borderRadius: 2 }}>Seleziona un'edizione dalla lista a sinistra per gestirne la struttura.</Alert>;

    return (
        <Stack spacing={4}>
            {/* Header / Quick Info */}
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Stagione {edition.name}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase' }}>
                        Configurazione Tecnica e Struttura
                    </Typography>
                </Box>
                <Stack direction="row" spacing={1}>
                    <Button
                        variant="contained"
                        size="small"
                        startIcon={<SaveIcon />}
                        onClick={handleSave}
                        disabled={isSaving}
                    >
                        {isSaving ? "Salvataggio..." : "Salva Stagione"}
                    </Button>
                    <IconButton color="error" size="small" onClick={() => onDelete(editionId)}>
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Stack>
            </Stack>

            <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, bgcolor: 'background.default' }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Nome Edizione (Stagione)"
                            size="small"
                            fullWidth
                            value={edition.name}
                            onChange={(e) => handleFieldChange("name", e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <TextField
                            label="N. Max Partecipanti"
                            type="number"
                            size="small"
                            fullWidth
                            value={edition.metadata?.maxParticipants ?? ""}
                            onChange={(e) => handleMetadataChange("maxParticipants", parseInt(e.target.value))}
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Formato</InputLabel>
                            <Select
                                value={edition.metadata?.competitionFormat ?? "LEAGUE"}
                                label="Formato"
                                onChange={(e) => handleMetadataChange("competitionFormat", e.target.value)}
                            >
                                <MenuItem value="LEAGUE">Campionato</MenuItem>
                                <MenuItem value="COMPOSTA">Misto / Coppe</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </Paper>

            <Divider />

            {/* Technical Structure (Phases and Groups) */}
            <Box>
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip label="STEP 2" size="small" color="primary" sx={{ height: 20, fontWeight: 'bold' }} />
                    FASI E GIRONI
                </Typography>
                <PhaseManagement editionId={editionId} />
            </Box>
        </Stack>
    );
}

EditionEditor.propTypes = {
    editionId: PropTypes.number,
    onUpdate: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired
};

export default EditionEditor;
