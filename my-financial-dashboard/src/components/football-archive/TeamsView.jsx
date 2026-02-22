import { useState } from "react";
import PropTypes from "prop-types";
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Stack,
  Typography,
  IconButton,
  Box,
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import EditTeamDialog from "./EditTeamDialog";
import { UserRoles } from "../../constants/roles";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";
import AddTeamDialog from "./AddTeamDialog";

function TeamsView({ teams, loading, onTeamAdded, editionId, isCompact = false }) {
  const { t } = useTranslation();
  const { user, token } = useAuth();
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleInsertCompleted = () => {
    // Refresh the list
    if (onTeamAdded) {
      onTeamAdded();
    }
  };

  const handleEditOpen = (team) => {
    setSelectedTeam(team);
    setEditOpen(true);
  };

  const handleDeleteTeam = async (teamId) => {
    if (!window.confirm(t("football.confirm_delete_team", "Are you sure you want to delete this team? All associated matches will be deleted."))) {
      return;
    }

    try {
      const apiUrl = `${import.meta.env.VITE_SERVER_URL}/api/teams/${teamId}`;
      const response = await fetch(apiUrl, {
        method: "DELETE",
        headers: {
          ...(token && { "Authorization": `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete team");
      }

      if (onTeamAdded) {
        onTeamAdded();
      }
    } catch (err) {
      console.error("Error deleting team:", err);
      alert(t("football.error_deleting_team", { defaultValue: "Error deleting team: {{message}}", message: err.message }));
    }
  };

  const canManage = user?.role === UserRoles.ADMIN || user?.role === UserRoles.EDITOR;

  const listContent = (
    <List sx={{ p: 0 }}>
      {teams.map((element) => (
        <ListItem
          key={element.id}
          disablePadding
          secondaryAction={canManage && (
            <>
              <IconButton size="small" onClick={() => handleEditOpen(element)} color="primary">
                <EditIcon sx={{ fontSize: 14 }} />
              </IconButton>
              <IconButton size="small" onClick={() => handleDeleteTeam(element.id)} color="error">
                <DeleteIcon sx={{ fontSize: 14 }} />
              </IconButton>
            </>
          )}
          sx={{
            py: 0.5,
            px: 1,
            "&:hover": { bgcolor: "action.hover" },
            borderRadius: 1,
            mb: 0.5
          }}
        >
          <ListItemText
            primary={element.name}
            primaryTypographyProps={{
              variant: "body2",
              fontWeight: "medium",
              noWrap: true
            }}
            secondary={!isCompact ? element.city : null}
          />
        </ListItem>
      ))}
    </List>
  );

  return (
    <Stack spacing={1}>
      {!isCompact && (
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ borderBottom: "1px solid rgba(0,0,0,0.12)", pb: 1, mb: 1 }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            {t("football.teams")}
          </Typography>
          {canManage && (
            <IconButton
              onClick={handleClickOpen}
              color="primary"
              size="small"
              sx={{
                backgroundColor: "action.hover",
                "&:hover": { backgroundColor: "action.selected" },
              }}
            >
              <AddIcon fontSize="small" />
            </IconButton>
          )}
        </Stack>
      )}

      {/* Simplified header for empty/setup state */}
      {teams.length === 0 && !loading && canManage && (
        <Box sx={{ textAlign: "center", py: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {t("football.no_teams", "Nessuna squadra presente")}
          </Typography>
          <Button
            startIcon={<AddIcon />}
            variant="outlined"
            size="small"
            onClick={handleClickOpen}
            sx={{ borderRadius: 2, textTransform: "none" }}
          >
            {t("football.add_first_team", "Aggiungi la prima squadra")}
          </Button>
        </Box>
      )}

      {teams.length > 0 && isCompact && canManage && (
        <Button
          startIcon={<AddIcon />}
          size="small"
          onClick={handleClickOpen}
          sx={{ alignSelf: "flex-start", fontSize: "0.75rem", px: 1, py: 0.2 }}
        >
          {t("football.add_team", "Aggiungi Squadra")}
        </Button>
      )}

      <AddTeamDialog
        open={open}
        onClose={handleClose}
        onInsert={handleInsertCompleted}
        editionId={editionId}
      />

      <EditTeamDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onUpdate={handleInsertCompleted}
        team={selectedTeam}
      />

      {loading ? (
        <Typography variant="caption" align="center">{t("football.loading_teams")}</Typography>
      ) : teams.length > 0 ? (
        listContent
      ) : (
        !canManage && !loading && (
          <Typography variant="body2" color="text.secondary" align="center">
            {t("football.no_teams")}
          </Typography>
        )
      )}
    </Stack>
  );
}

TeamsView.propTypes = {
  teams: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      city: PropTypes.string.isRequired,
    }),
  ).isRequired,
  loading: PropTypes.bool.isRequired,
  onTeamAdded: PropTypes.func,
  editionId: PropTypes.number,
  isCompact: PropTypes.bool,
};

export default TeamsView;
