import CompetitionSelector from "./CompetitionSelector";
import {
  Grid,
  Paper,
  Stack,
  TableContainer,
  Table,
  Typography,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  Drawer,
  Button,
} from "@mui/material";
import TeamsView from "./TeamsView";
import AddMatchForm from "./AddMatchForm";
import { useState, useEffect } from "react";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

function FootballArchiveView() {
  const [open, setOpen] = useState(false);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [teams, setTeams] = useState([]);
  const [teamsLoading, setTeamsLoading] = useState(true);
  const [selectedCompetition, setSelectedCompetition] = useState(null);

  const fetchMatches = () => {
    if (!selectedCompetition) {
      console.error("Cannot fetch matches: No competition selected");
      setError("Please select a competition first");
      setLoading(false);
      return;
    }

    const apiUrl = new URL(`${import.meta.env.VITE_SERVER_URL}/api/matches`);
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setMatches(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching matches:", error);
        setError(error.message);
        setLoading(false);
      });
  };

  const fetchTeams = () => {
    const apiUrl = new URL(`${import.meta.env.VITE_SERVER_URL}/api/teams`);
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
  };

  const handleCompetitionSelect = (competition) => {
    setSelectedCompetition(competition);
    // Close the drawer after selection
    setOpen(false);
    // Refetch matches for the selected competition
    setTimeout(() => fetchMatches(), 0);
  };

  useEffect(() => {
    fetchMatches();
    fetchTeams();
  }, []);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };
  return (
    <>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        <CompetitionSelector
          onCompetitionSelect={handleCompetitionSelect}
          selectedCompetitionId={selectedCompetition?.id}
        ></CompetitionSelector>
      </Drawer>
      <Stack direction="row">
        <Button onClick={toggleDrawer(true)} variant="outlined">
          <KeyboardArrowRightIcon></KeyboardArrowRightIcon>
          {selectedCompetition ? selectedCompetition.name : "All Competitions"}
        </Button>
      </Stack>
      {selectedCompetition ? (
        <Stack>
          <Grid container spacing={2}>
            <Grid size={4}>
              <TeamsView
                teams={teams}
                loading={teamsLoading}
                onTeamAdded={fetchTeams}
              ></TeamsView>
            </Grid>
            <Grid size={8}>
              <Typography variant="h4">Matches</Typography>
              <TableContainer component={Paper}>
                <Table
                  sx={{ minWidth: 650 }}
                  size="small"
                  aria-label="simple table"
                >
                  <TableHead>
                    <TableRow>
                      <TableCell>Home Team</TableCell>
                      <TableCell>Away Team</TableCell>
                      <TableCell>Home Score</TableCell>
                      <TableCell>Away Score</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading && (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          Loading matches...
                        </TableCell>
                      </TableRow>
                    )}
                    {error && !loading && (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          align="center"
                          style={{ color: "red" }}
                        >
                          Error: {error}
                        </TableCell>
                      </TableRow>
                    )}
                    {!loading && !error && matches.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          No matches found
                        </TableCell>
                      </TableRow>
                    )}
                    {!loading &&
                      !error &&
                      matches.length > 0 &&
                      matches.map((match) => (
                        <TableRow key={match.id}>
                          <TableCell>
                            {match.homeTeam?.name || "Unknown"}
                          </TableCell>
                          <TableCell>
                            {match.awayTeam?.name || "Unknown"}
                          </TableCell>
                          <TableCell>{match.homeScore}</TableCell>
                          <TableCell>{match.awayScore}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <AddMatchForm
                onMatchAdded={fetchMatches}
                teams={teams}
                teamsLoading={teamsLoading}
                selectedCompetition={selectedCompetition}
              ></AddMatchForm>
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
