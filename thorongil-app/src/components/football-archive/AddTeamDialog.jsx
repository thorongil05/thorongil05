import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { Dialog, DialogTitle, Stack, TextField, Button, Checkbox, FormControlLabel, Box, Typography, DialogContent, DialogActions } from "@mui/material";
import { apiPost } from "../../utils/api";


function AddTeamDialog({ onClose, open, onInsert, editionId }) {
  const nameInputRef = useRef(null);
  const [addAnother, setAddAnother] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    city: "",
  });

  useEffect(() => {
    if (open) {
      setFormData({ name: "", city: "" });
      setAddAnother(false);
    }
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await apiPost(`/api/teams/`, { ...formData, editionId });

      if (addAnother) {
        setFormData({ name: "", city: "" });
        onInsert(); // Refresh list in background
        setTimeout(() => {
          if (nameInputRef.current) {
            nameInputRef.current.focus();
          }
        }, 0);
      } else {
        onInsert();
        onClose();
      }
    } catch (error) {
      console.error("Error adding team:", error);
      alert("Error adding team: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      onClose={onClose}
      open={open}
    >
      <DialogTitle>Add Participant to Competition</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ minWidth: 300, mt: 1 }}>
            <TextField
              size="small"
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              inputRef={nameInputRef}
              required
              autoFocus
            />
            <TextField
              size="small"
              label="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={addAnother}
                  onChange={(e) => setAddAnother(e.target.checked)}
                  size="small"
                />
              }
              label={<Typography variant="body2">Add another</Typography>}
            />
            <Stack direction="row" spacing={1}>
              <Button onClick={onClose} size="small">Cancel</Button>
              <Button
                type="submit"
                variant="contained"
                size="small"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Adding..." : "Submit"}
              </Button>
            </Stack>
          </Box>
        </DialogActions>
      </form>
    </Dialog>
  );
}

AddTeamDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  onInsert: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  editionId: PropTypes.number,
};

export default AddTeamDialog;
