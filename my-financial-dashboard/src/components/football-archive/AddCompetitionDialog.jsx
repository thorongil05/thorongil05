import { useState } from "react";
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
} from "@mui/material";
import { useAuth } from "../../context/AuthContext";

function submit(e, formData, token, onSubmitAction) {
  e.preventDefault();
  const apiUrl = `${import.meta.env.VITE_SERVER_URL}/api/competitions/`;
  console.log("Calling submit on url", apiUrl);
  let options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token && { "Authorization": `Bearer ${token}` }),
    },
    body: JSON.stringify(formData),
  };
  console.log(JSON.stringify(options));
  fetch(apiUrl, options)
    .then((response) => {
      console.log(response.json());
      console.log("Success, executing on submit action");
      onSubmitAction();
    })
    .catch((error) => {
      console.error(error);
    });
}

function AddCompetitionDialog({ onClose, open, onInsert }) {
  const { token } = useAuth();
  let [formData, setFormData] = useState({
    name: "",
    country: "",
    type: "LEAGUE", // Default to LEAGUE
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>Aggiungi competizione</DialogTitle>
      <form>
        <Stack spacing={2} sx={{ p: 2, minWidth: "300px" }}>
          <TextField
            size="small"
            label="Nome"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
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
          <Button
            variant="contained"
            type="submit"
            onClick={(e) =>
              submit(e, formData, token, () => {
                onInsert();
                setFormData({ name: "", country: "", type: "LEAGUE" }); // Reset form
              })
            }
          >
            Salva
          </Button>
        </Stack>
      </form>
    </Dialog>
  );
}

AddCompetitionDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  onInsert: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

export default AddCompetitionDialog;
