import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
    Stack,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Box,
    Divider,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { apiPost, apiPut } from "../../../utils/api";

function CompetitionForm({ competitionToEdit, onSubmitSuccess, onCancel }) {
    const initialFormState = {
        name: "",
        country: "",
        type: "LEAGUE",
        metadata: {},
    };

    let [formData, setFormData] = useState(initialFormState);
    let [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (competitionToEdit) {
            setFormData({
                name: competitionToEdit.name || "",
                country: competitionToEdit.country || "",
                type: competitionToEdit.type || "LEAGUE",
                metadata: {},
            });
        } else {
            setFormData(initialFormState);
        }
    }, [competitionToEdit]);

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
            if (competitionToEdit) {
                await apiPut(`/api/competitions/${competitionToEdit.id}`, formData);
            } else {
                await apiPost(`/api/competitions/`, formData);
            }
            onSubmitSuccess();
        } catch (error) {
            console.error("Error submitting competition:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <Stack spacing={3}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Informazioni Generali
                </Typography>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <TextField
                        label="Nome Competizione"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        fullWidth
                        required
                        variant="outlined"
                    />
                    <TextField
                        label="Paese/Regione"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                    />
                </Stack>

                <FormControl fullWidth>
                    <InputLabel id="type-select-label">Tipo di Competizione</InputLabel>
                    <Select
                        labelId="type-select-label"
                        id="type-select"
                        value={formData.type}
                        label="Tipo di Competizione"
                        name="type"
                        onChange={handleChange}
                    >
                        <MenuItem value={"LEAGUE"}>Campionato (Girone unico)</MenuItem>
                        <MenuItem value={"CUP"}>Coppa (Eliminazione diretta)</MenuItem>
                        <MenuItem value={"FRIENDLY"}>Amichevole / Torneo</MenuItem>
                    </Select>
                </FormControl>


                <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
                    <Button
                        variant="outlined"
                        onClick={onCancel}
                        disabled={isSubmitting}
                        sx={{ minWidth: 120 }}
                    >
                        Annulla
                    </Button>
                    <Button
                        variant="contained"
                        type="submit"
                        disabled={isSubmitting}
                        sx={{ minWidth: 150, fontWeight: 'bold' }}
                    >
                        {isSubmitting ? "Salvataggio..." : (competitionToEdit ? "Aggiorna Competizione" : "Crea Competizione")}
                    </Button>
                </Stack>
            </Stack>
        </Box>
    );
}

CompetitionForm.propTypes = {
    competitionToEdit: PropTypes.object,
    onSubmitSuccess: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
};

export default CompetitionForm;
