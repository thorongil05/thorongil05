import { useState } from "react";
import PropTypes from "prop-types";
import { Dialog, DialogTitle, Stack, TextField, Button } from "@mui/material";
import { useAuth } from "../../context/AuthContext";

function submit(e, formData, token, onSubmitAction) {
  e.preventDefault();
  const apiUrl = `${import.meta.env.VITE_SERVER_URL}/api/teams/`;
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
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error(error);
    });
}

function AddTeamDialog({ onClose, open, onInsert, competitionId }) {
  const { token } = useAuth();
  let [formData, setFormData] = useState({
    name: "",
    city: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>Aggiungi squadra al campionato</DialogTitle>
      <form>
        <Stack spacing={2} className="m-3">
          <TextField
            size="small"
            label="Nome"
            name="name"
            value={formData.name}
            onChange={handleChange}
          ></TextField>
          <TextField
            size="small"
            label="Cittá"
            name="city"
            value={formData.city}
            onChange={handleChange}
          ></TextField>
          <Button
            type="submit"
            onClick={(e) =>
              submit(
                e,
                { ...formData, competitionId: competitionId },
                token,
                () => {
                  onInsert();
                },
              )
            }
          >
            Submit
          </Button>
        </Stack>
      </form>
    </Dialog>
  );
}

AddTeamDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  onInsert: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  competitionId: PropTypes.number,
};

export default AddTeamDialog;
