import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
} from "@mui/material";
import { useState, useEffect } from "react";
import { UserRoles } from "../../constants/roles";
import { useTranslation } from "react-i18next";

function UserEditDialog({ open, onClose, onUpdate, user, token }) {
  const { t } = useTranslation();
  const [role, setRole] = useState("");

  useEffect(() => {
    if (user) {
      setRole(user.role);
    }
  }, [user]);

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/users/${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update user role");
      }

      onUpdate();
      onClose();
    } catch (err) {
      console.error("Error updating user role:", err);
      alert(err.message);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{t("admin.edit_user_role", "Edit User Role")}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <FormControl fullWidth>
            <InputLabel id="role-select-label">{t("admin.role", "Role")}</InputLabel>
            <Select
              labelId="role-select-label"
              id="role-select"
              value={role}
              label={t("admin.role", "Role")}
              onChange={(e) => setRole(e.target.value)}
            >
              {Object.values(UserRoles)
                .filter((roleValue) => roleValue !== UserRoles.ADMIN)
                .map((roleValue) => (
                  <MenuItem key={roleValue} value={roleValue}>
                    {roleValue.toUpperCase()}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t("common.cancel", "Cancel")}</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {t("common.save", "Save")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default UserEditDialog;
