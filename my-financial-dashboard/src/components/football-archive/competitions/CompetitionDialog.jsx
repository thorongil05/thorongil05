import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
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
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useAuth } from "../../../context/AuthContext";
import { apiPost, apiPut } from "../../../utils/api";

async function submit(e, formData, competitionToEdit, onSubmitAction) {
  e.preventDefault();
  try {
    if (competitionToEdit) {
      await apiPut(`/api/competitions/${competitionToEdit.id}`, formData);
    } else {
      await apiPost(`/api/competitions/`, formData);
    }
    console.log("Success, executing on submit action");
    onSubmitAction();
  } catch (error) {
    console.error(error);
  }
}

function CompetitionDialog({ onClose, open, onInsert, competitionToEdit }) {
  const { token } = useAuth();
  const initialFormState = {
    name: "",
    country: "",
    type: "LEAGUE",
    metadata: {
      totalMatches: "",
      phasesCount: "",
      maxParticipants: "",
      competitionFormat: "",
    },
  };
  let [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    if (competitionToEdit) {
      setFormData({
        name: competitionToEdit.name || "",
        country: competitionToEdit.country || "",
        type: competitionToEdit.type || "LEAGUE",
        metadata: {
          totalMatches: competitionToEdit.metadata?.totalMatches || "",
          phasesCount: competitionToEdit.metadata?.phasesCount || "",
          maxParticipants: competitionToEdit.metadata?.maxParticipants || "",
          competitionFormat: competitionToEdit.metadata?.competitionFormat || "",
        },
      });
    } else {
      setFormData(initialFormState);
    }
  }, [competitionToEdit, open]);

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

  const dialogTitle = competitionToEdit ? "Modifica competizione" : "Aggiungi competizione";

  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>{dialogTitle}</DialogTitle>
      <form onSubmit={(e) => submit(e, formData, competitionToEdit, () => {
        onInsert();
        setFormData(initialFormState);
      })}>
        <Stack spacing={2} sx={{ p: 2, minWidth: "350px" }}>
          <TextField
            size="small"
            label="Nome"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            size="small"
            label="Paese"
            name="country"
            value={formData.country}
            onChange={handleChange}
            fullWidth
          />
          <FormControl fullWidth size="small">
            <InputLabel id="type-select-label">Tipo</InputLabel>
            <Select
              labelId="type-select-label"
              id="type-select"
              value={formData.type}
              label="Tipo"
              name="type"
              onChange={handleChange}
            >
              <MenuItem value={"LEAGUE"}>Campionato</MenuItem>
              <MenuItem value={"CUP"}>Coppa</MenuItem>
              <MenuItem value={"FRIENDLY"}>Amichevole</MenuItem>
            </Select>
          </FormControl>

          {/* Optional Advanced Info Section */}
          <Accordion variant="outlined" sx={{ border: '1px solid', borderColor: 'divider', borderRadius: '4px !important' }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Informazioni Avanzate (Opzionali)</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={2}>
                <TextField
                  size="small"
                  label="Numero partite totali"
                  name="totalMatches"
                  type="number"
                  value={formData.metadata.totalMatches}
                  onChange={handleMetadataChange}
                  fullWidth
                />
                <TextField
                  size="small"
                  label="Numero fasi"
                  name="phasesCount"
                  type="number"
                  value={formData.metadata.phasesCount}
                  onChange={handleMetadataChange}
                  fullWidth
                />
                <TextField
                  size="small"
                  label="Numero massimo partecipanti"
                  name="maxParticipants"
                  type="number"
                  value={formData.metadata.maxParticipants}
                  onChange={handleMetadataChange}
                  fullWidth
                />
                <FormControl fullWidth size="small">
                  <InputLabel id="format-select-label">Tipologia</InputLabel>
                  <Select
                    labelId="format-select-label"
                    id="format-select"
                    value={formData.metadata.competitionFormat}
                    label="Tipologia"
                    name="competitionFormat"
                    onChange={handleMetadataChange}
                  >
                    <MenuItem value=""><em>Nessuna</em></MenuItem>
                    <MenuItem value="LEAGUE">Girone all'italiana</MenuItem>
                    <MenuItem value="COMPOSTA">Composta</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            </AccordionDetails>
          </Accordion>

          <Button
            variant="contained"
            type="submit"
            fullWidth
          >
            {competitionToEdit ? "Aggiorna" : "Salva"}
          </Button>
        </Stack>
      </form>
    </Dialog>
  );
}

CompetitionDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  onInsert: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  competitionToEdit: PropTypes.object,
};

export default CompetitionDialog;
