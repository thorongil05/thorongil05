import CompetitionSelector from "./CompetitionSelector";
import {
  Grid,
  Stack,
  Typography,
  Drawer,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import TeamsView from "./TeamsView";
import MatchesView from "./MatchesView";
import StandingsView from "./StandingsView";
import { useState, useEffect, useCallback } from "react";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import PeopleIcon from "@mui/icons-material/People";

function FootballArchiveView() {
  const [open, setOpen] = useState(false);
  const [teams, setTeams] = useState([]);
  const [teamsLoading, setTeamsLoading] = useState(true);
  const [selectedCompetition, setSelectedCompetition] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [participantsOpen, setParticipantsOpen] = useState(false);

  const fetchTeams = useCallback((competition) => {
    let apiUrl;
    if (competition) {
      apiUrl = new URL(
        `${import.meta.env.VITE_SERVER_URL}/api/competitions/${competition.id}/teams`,
      );
    } else {
      apiUrl = new URL(`${import.meta.env.VITE_SERVER_URL}/api/teams`);
    }

    fetch(apiUrl)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        let retrievedTeams = data.map((element) => {
          return {
            id: element.id,
            name: element.name,
            city: element.city,
          };
        });
        setTeams(retrievedTeams);
        setTeamsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching teams:", error);
        setTeamsLoading(false);
      });
  }, []);

  const handleCompetitionSelect = (competition) => {
    setSelectedCompetition(competition);
    // Close the drawer after selection
    setOpen(false);
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  useEffect(() => {
    if (selectedCompetition) {
      fetchTeams(selectedCompetition);
    }
  }, [selectedCompetition, fetchTeams]);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  return (
    <>
      <Drawer open={open} onClose={toggleDrawer(false)} disablePortal>
        <CompetitionSelector
          onCompetitionSelect={handleCompetitionSelect}
          selectedCompetitionId={selectedCompetition?.id}
        ></CompetitionSelector>
      </Drawer>
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <Button onClick={toggleDrawer(true)} variant="outlined">
          <KeyboardArrowRightIcon></KeyboardArrowRightIcon>
          {selectedCompetition ? selectedCompetition.name : "All Competitions"}
        </Button>
        <Button
          onClick={() => setParticipantsOpen(true)}
          variant="outlined"
          startIcon={<PeopleIcon />}
          disabled={!selectedCompetition}
        >
          Participants
        </Button>
      </Stack>
      <Dialog
        open={participantsOpen}
        onClose={() => setParticipantsOpen(false)}
        maxWidth="sm"
        fullWidth
        disablePortal
      >
        <DialogTitle>Participants - {selectedCompetition?.name}</DialogTitle>
        <DialogContent dividers>
          <TeamsView
            teams={teams}
            loading={teamsLoading}
            onTeamAdded={() => fetchTeams(selectedCompetition)}
            competitionId={selectedCompetition?.id}
          ></TeamsView>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setParticipantsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
      {selectedCompetition ? (
        <Stack spacing={2}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <StandingsView
                selectedCompetition={selectedCompetition}
                refreshTrigger={refreshTrigger}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <MatchesView
                selectedCompetition={selectedCompetition}
                teams={teams}
                teamsLoading={teamsLoading}
                onMatchAdded={() => setRefreshTrigger((prev) => prev + 1)}
                refreshTrigger={refreshTrigger}
              />
            </Grid>
          </Grid>
        </Stack>
      ) : (
        <Typography
          variant="h5"
          align="center"
          style={{ marginTop: "40px", color: "#666" }}
        >
          Please select a competition from the side menu to view teams and
          matches.
        </Typography>
      )}
    </>
  );
}

export default FootballArchiveView;
