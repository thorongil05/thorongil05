import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { 
  Dialog, 
  DialogTitle, 
  Stack, 
  TextField, 
  Button, 
  DialogContent, 
  DialogActions 
} from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import { apiPut } from "../../utils/api";

function EditTeamDialog({ onClose, open, onUpdate, team }) {
  const { t } = useTranslation();
  const { token } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    city: "",
  });

  useEffect(() => {
    if (open && team) {
      setFormData({ 
        name: team.name || "", 
        city: team.city || "" 
      });
    }
  }, [open, team]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await apiPut(`/api/teams/${team.id}`, formData);

      onUpdate();
      onClose();
    } catch (error) {
      console.error("Error updating team:", error);
      alert(t("football.error_updating_team", { defaultValue: "Error updating team: {{message}}", message: error.message }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog 
      onClose={onClose} 
      open={open}
      disablePortal
    >
      <DialogTitle>{t("football.edit_team", "Edit Team")}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ minWidth: 300, mt: 1 }}>
            <TextField
              size="small"
              label={t("football.name")}
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              autoFocus
            />
            <TextField
              size="small"
              label={t("football.city")}
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Stack direction="row" spacing={1}>
            <Button onClick={onClose} size="small">{t("football.cancel")}</Button>
            <Button
              type="submit"
              variant="contained"
              size="small"
              disabled={isSubmitting}
            >
              {isSubmitting ? t("football.saving", "Saving...") : t("football.submit")}
            </Button>
          </Stack>
        </DialogActions>
      </form>
    </Dialog>
  );
}

EditTeamDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  team: PropTypes.object,
};

export default EditTeamDialog;
