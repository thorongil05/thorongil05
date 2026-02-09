import {
  Paper,
  Stack,
  TableContainer,
  Table,
  Typography,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import AddMatchDialog from "./AddMatchDialog";

function MatchesView({ selectedCompetition, teams, teamsLoading }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [matchDialogOpen, setMatchDialogOpen] = useState(false);

  const fetchMatches = useCallback(() => {
    setError(null);
    setLoading(true);

    if (!selectedCompetition) {
      setMatches([]);
      setLoading(false);
      return;
    }

    const urlSearchParams = new URLSearchParams({
      competitionId: selectedCompetition.id,
    });

    const apiUrl = new URL(`${import.meta.env.VITE_SERVER_URL}/api/matches`);
    fetch(apiUrl + "?" + urlSearchParams)
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
  }, [selectedCompetition]);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  return (
    <Stack>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2 }}
      >
        <Typography variant="h4">Matches</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setMatchDialogOpen(true)}
          disabled={!selectedCompetition}
        >
          Add Match
        </Button>
      </Stack>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="simple table">
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
                <TableCell colSpan={4} align="center" style={{ color: "red" }}>
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
                  <TableCell>{match.homeTeam?.name || "Unknown"}</TableCell>
                  <TableCell>{match.awayTeam?.name || "Unknown"}</TableCell>
                  <TableCell>{match.homeScore}</TableCell>
                  <TableCell>{match.awayScore}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <AddMatchDialog
        open={matchDialogOpen}
        onClose={() => setMatchDialogOpen(false)}
        onMatchAdded={fetchMatches}
        teams={teams}
        teamsLoading={teamsLoading}
        selectedCompetition={selectedCompetition}
      ></AddMatchDialog>
    </Stack>
  );
}

MatchesView.propTypes = {
  selectedCompetition: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string,
  }),
  teams: PropTypes.array.isRequired,
  teamsLoading: PropTypes.bool.isRequired,
};

export default MatchesView;
