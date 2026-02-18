import { useState } from "react";
import PropTypes from "prop-types";
import {
  Stack,
  Typography,
  IconButton,
  Card,
  CardContent,
  Grid,
  Box,
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import GroupsIcon from "@mui/icons-material/Groups";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import EditTeamDialog from "./EditTeamDialog";
import { UserRoles } from "../../constants/roles";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";
import AddTeamDialog from "./AddTeamDialog";

function TeamsView({ teams, loading, onTeamAdded, competitionId, isCompact = false }) {
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

  const listContent = (
    <Grid container spacing={1}>
      {teams.map((element) => (
        <Grid size={12} key={element.id}>
          <Card
            variant="outlined"
            sx={{
              transition: "0.3s",
              "&:hover": {
                boxShadow: 1,
                borderColor: "primary.main",
              },
            }}
          >
            <CardContent sx={{ padding: isCompact ? "6px 12px !important" : "8px 16px !important" }}>
              <Stack direction="row" spacing={isCompact ? 1 : 2} alignItems="center">
                <GroupsIcon color="action" fontSize={isCompact ? "small" : "medium"} />
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ width: "100%" }}
                >
                  <Typography variant={isCompact ? "body2" : "subtitle1"} component="div" sx={{ fontWeight: isCompact ? "medium" : "normal" }}>
                    {element.name}
                  </Typography>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    {!isCompact && (
                      <Typography variant="body2" color="text.secondary">
                        {element.city}
                      </Typography>
                    )}
                    {(user?.role === UserRoles.ADMIN || user?.role === UserRoles.EDITOR) && (
                      <Stack direction="row">
                        <IconButton size="small" onClick={() => handleEditOpen(element)} color="primary">
                          <EditIcon sx={{ fontSize: isCompact ? 14 : 18 }} />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleDeleteTeam(element.id)} color="error">
                          <DeleteIcon sx={{ fontSize: isCompact ? 14 : 18 }} />
                        </IconButton>
                      </Stack>
                    )}
                  </Stack>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      ))}
      {teams.length === 0 && (
        <Grid size={12}>
          <Typography variant="body2" color="text.secondary" align="center">
            {t("football.no_teams")}
          </Typography>
        </Grid>
      )}
    </Grid>
  );

  return (
    <Stack spacing={isCompact ? 1 : 2}>
      {!isCompact && (
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ borderBottom: "1px solid rgba(0,0,0,0.12)", pb: 1 }}
        >
          <Typography variant="h5" component="div" sx={{ fontWeight: "bold" }}>
            {t("football.teams")}
          </Typography>
          {(user?.role === UserRoles.ADMIN || user?.role === UserRoles.EDITOR) && (
            <IconButton
              onClick={handleClickOpen}
              color="primary"
              sx={{
                backgroundColor: "action.hover",
                "&:hover": { backgroundColor: "action.selected" },
              }}
            >
              <AddIcon />
            </IconButton>
          )}
        </Stack>
      )}

      {/* For compact mode, the "Add" button is handled by the parent or differently */}
      {isCompact && (user?.role === UserRoles.ADMIN || user?.role === UserRoles.EDITOR) && (
        <Button
          startIcon={<AddIcon />}
          size="small"
          onClick={handleClickOpen}
          sx={{ alignSelf: "flex-start", fontSize: "0.7rem", mb: 0.5 }}
        >
          {t("football.add_team", "Add Team")}
        </Button>
      )}

      <AddTeamDialog
        open={open}
        onClose={handleClose}
        onInsert={handleInsertCompleted}
        competitionId={competitionId}
      />

      <EditTeamDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onUpdate={handleInsertCompleted}
        team={selectedTeam}
      />

      {loading ? (
        <Typography variant="body2">{t("football.loading_teams")}</Typography>
      ) : isCompact ? (
        listContent
      ) : (
        <Box sx={{ maxHeight: "calc(100vh - 300px)", overflowY: "auto" }}>
          {listContent}
        </Box>
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
  competitionId: PropTypes.number,
  isCompact: PropTypes.bool,
};

export default TeamsView;
