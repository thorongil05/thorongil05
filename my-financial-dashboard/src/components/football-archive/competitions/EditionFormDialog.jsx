import { useState, useEffect } from "react";
import {
    Stack,
    TextField,
    Button,
    Typography,
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PropTypes from "prop-types";
import { apiPost, apiPut } from "../../../utils/api";

function EditionFormDialog({ open, onClose, editionToEdit, competitionId, onSuccess }) {
    const initialFormState = {
        name: "",
        metadata: {
            totalMatches: "",
            phasesCount: "1",
            maxParticipants: "",
            competitionFormat: "LEAGUE",
        },
    };

    const [formData, setFormData] = useState(initialFormState);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (editionToEdit) {
            setFormData({
                name: editionToEdit.name || "",
                metadata: {
                    totalMatches: editionToEdit.metadata?.totalMatches || "",
                    phasesCount: editionToEdit.metadata?.phasesCount || "1",
                    maxParticipants: editionToEdit.metadata?.maxParticipants || "",
                    competitionFormat: editionToEdit.metadata?.competitionFormat || "LEAGUE",
                },
            });
        } else {
            setFormData(initialFormState);
        }
    }, [editionToEdit, open]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleMetadataChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            metadata: { ...prev.metadata, [name]: value },
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (editionToEdit) {
                await apiPut(`/api/competitions/editions/${editionToEdit.id}`, formData);
            } else {
                await apiPost(`/api/competitions/${competitionId}/editions`, formData);
            }
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Error submitting edition:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ fontWeight: 'bold' }}>
                {editionToEdit ? "Modifica Edizione" : "Nuova Edizione / Stagione"}
            </DialogTitle>
            <Box component="form" onSubmit={handleSubmit}>
                <DialogContent dividers>
                    <Stack spacing={3}>
                        <TextField
                            label="Nome Edizione (es. 2023/24)"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            fullWidth
                            required
                            variant="outlined"
                        />

                        <Accordion defaultExpanded variant="outlined" sx={{ borderRadius: 2 }}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                                    Configurazione Stagionale
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Stack spacing={2}>
                                    <Stack direction="row" spacing={2}>
                                        <TextField
                                            label="Partite Totali"
                                            name="totalMatches"
                                            type="number"
                                            value={formData.metadata.totalMatches}
                                            onChange={handleMetadataChange}
                                            fullWidth
                                        />
                                        <TextField
                                            label="N. Massimo Partecipanti"
                                            name="maxParticipants"
                                            type="number"
                                            value={formData.metadata.maxParticipants}
                                            onChange={handleMetadataChange}
                                            fullWidth
                                        />
                                    </Stack>
                                    <Stack direction="row" spacing={2}>
                                        <TextField
                                            label="Numero Fasi"
                                            name="phasesCount"
                                            type="number"
                                            value={formData.metadata.phasesCount}
                                            onChange={handleMetadataChange}
                                            fullWidth
                                        />
                                        <FormControl fullWidth>
                                            <InputLabel>Formato</InputLabel>
                                            <Select
                                                name="competitionFormat"
                                                value={formData.metadata.competitionFormat}
                                                onChange={handleMetadataChange}
                                                label="Formato"
                                            >
                                                <MenuItem value="LEAGUE">Campionato</MenuItem>
                                                <MenuItem value="COMPOSTA">Misto / Coppe</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Stack>
                                </Stack>
                            </AccordionDetails>
                        </Accordion>
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={onClose} disabled={isSubmitting}>Annulla</Button>
                    <Button type="submit" variant="contained" disabled={isSubmitting}>
                        {isSubmitting ? "Salvataggio..." : "Salva"}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
}

EditionFormDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    competitionId: PropTypes.number,
    editionToEdit: PropTypes.object,
    onSuccess: PropTypes.func.isRequired,
};

export default EditionFormDialog;
