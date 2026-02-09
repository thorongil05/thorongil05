import { useState } from "react";
import PropTypes from "prop-types";
import {
  Stack,
  Typography,
  IconButton,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import AddTeamDialog from "./AddTeamDialog";
import AddIcon from "@mui/icons-material/Add";
import GroupsIcon from "@mui/icons-material/Groups";

function TeamsView({ teams, loading, onTeamAdded, competitionId }) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleInsertCompleted = () => {
    setOpen(false);
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
          Teams
        </Typography>
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
        <AddTeamDialog
          open={open}
          onClose={handleClose}
          onInsert={handleInsertCompleted}
          competitionId={competitionId}
        ></AddTeamDialog>
      </Stack>

      {loading ? (
        <Typography>Loading teams...</Typography>
      ) : (
        <Grid container spacing={2}>
          {teams.map((element) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={element.id}>
              <Card
                variant="outlined"
                sx={{
                  height: "100%",
                  transition: "0.3s",
                  "&:hover": {
                    boxShadow: 3,
                    borderColor: "primary.main",
                  },
                }}
              >
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <GroupsIcon color="action" fontSize="large" />
                    <Stack>
                      <Typography variant="h6" component="div">
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
                No teams found in this competition.
              </Typography>
            </Grid>
          )}
        </Grid>
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
