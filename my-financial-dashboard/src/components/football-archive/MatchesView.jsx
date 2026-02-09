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
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import AddMatchDialog from "./AddMatchDialog";

function MatchesView({ selectedCompetition, teams, teamsLoading }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [matchDialogOpen, setMatchDialogOpen] = useState(false);
  const [matchToEdit, setMatchToEdit] = useState(null);
  const [rounds, setRounds] = useState([]);
  const [selectedRound, setSelectedRound] = useState("All");

  const fetchRounds = useCallback(() => {
    if (!selectedCompetition) {
      setRounds([]);
      return;
    }

    const urlSearchParams = new URLSearchParams({
      competitionId: selectedCompetition.id,
    });
    const apiUrl = new URL(`${import.meta.env.VITE_SERVER_URL}/api/matches/rounds`);
    fetch(apiUrl + "?" + urlSearchParams)
      .then((response) => response.json())
      .then((data) => setRounds(data))
      .catch((err) => console.error("Error fetching rounds:", err));
  }, [selectedCompetition]);

  const fetchMatches = useCallback(() => {
    setError(null);
    setLoading(true);

    if (!selectedCompetition) {
      setMatches([]);
      setLoading(false);
      return;
    }

    const params = {
      competitionId: selectedCompetition.id,
    };
    if (selectedRound && selectedRound !== "All") {
      params.round = selectedRound;
    }

    const urlSearchParams = new URLSearchParams(params);

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
  }, [selectedCompetition, selectedRound]);

  useEffect(() => {
    fetchRounds();
    setSelectedRound("All");
  }, [fetchRounds]);

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
        <Stack direction="row" spacing={2}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel id="round-select-label">Round</InputLabel>
            <Select
              labelId="round-select-label"
              id="round-select"
              value={selectedRound}
              label="Round"
              onChange={(e) => setSelectedRound(e.target.value)}
              disabled={!selectedCompetition}
            >
              <MenuItem value="All">All Rounds</MenuItem>
              {rounds.map((round) => (
                <MenuItem key={round} value={round}>
                  {round}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setMatchToEdit(null);
              setMatchDialogOpen(true);
            }}
            disabled={!selectedCompetition}
          >
            Add Match
          </Button>
        </Stack>
      </Stack>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Round</TableCell>
              <TableCell>Home Team</TableCell>
              <TableCell>Away Team</TableCell>
              <TableCell colSpan={2} align="center">Score</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Loading matches...
                </TableCell>
              </TableRow>
            )}
            {error && !loading && (
              <TableRow>
                <TableCell colSpan={6} align="center" style={{ color: "red" }}>
                  Error: {error}
                </TableCell>
              </TableRow>
            )}
            {!loading && !error && matches.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No matches found
                </TableCell>
              </TableRow>
            )}
            {!loading &&
              !error &&
              matches.length > 0 &&
              matches.map((match) => (
                <TableRow key={match.id}>
                  <TableCell>{match.round || "-"}</TableCell>
                  <TableCell>{match.homeTeam?.name || "Unknown"}</TableCell>
                  <TableCell>{match.awayTeam?.name || "Unknown"}</TableCell>
                  <TableCell colSpan={2} align="center">{match.homeScore} - {match.awayScore}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => {
                        setMatchToEdit(match);
                        setMatchDialogOpen(true);
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <AddMatchDialog
        open={matchDialogOpen}
        onClose={() => {
          setMatchDialogOpen(false);
          setMatchToEdit(null);
        }}
        onMatchAdded={() => {
          fetchMatches();
          fetchRounds();
        }}
        teams={teams}
        teamsLoading={teamsLoading}
        selectedCompetition={selectedCompetition}
        matchToEdit={matchToEdit}
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
