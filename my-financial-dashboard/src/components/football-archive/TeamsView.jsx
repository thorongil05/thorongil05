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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AddTeamDialog from "./AddTeamDialog";
import GroupsIcon from "@mui/icons-material/Groups";
import { UserRoles } from "../../constants/roles";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";

function TeamsView({ teams, loading, onTeamAdded, competitionId }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

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

  return (
    <Stack spacing={2}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ borderBottom: "1px solid rgba(0,0,0,0.12)", pb: 1 }}
      >
        <Typography variant="h5" component="div" sx={{ fontWeight: "bold" }}>
          {t("football.teams")}
        </Typography>
        {user?.role === UserRoles.ADMIN && (
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

      <AddTeamDialog
        open={open}
        onClose={handleClose}
        onInsert={handleInsertCompleted}
        competitionId={competitionId}
      />

      {loading ? (
        <Typography>{t("football.loading_teams")}</Typography>
      ) : (
        <Box sx={{ maxHeight: "calc(100vh - 300px)", overflowY: "auto" }}>
          <Grid container spacing={1}>
            {teams.map((element) => (
              <Grid size={12} key={element.id}>
                <Card
                  variant="outlined"
                  sx={{
                    transition: "0.3s",
                    "&:hover": {
                      boxShadow: 2,
                      borderColor: "primary.main",
                    },
                  }}
                >
                  <CardContent sx={{ padding: "8px 16px !important" }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <GroupsIcon color="action" />
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{ width: "100%" }}
                      >
                        <Typography variant="subtitle1" component="div">
                          {element.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {element.city}
                        </Typography>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
            {teams.length === 0 && (
              <Grid size={12}>
                <Typography variant="body1" color="text.secondary">
                  {t("football.no_teams")}
                </Typography>
              </Grid>
            )}
          </Grid>
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
};

export default TeamsView;
