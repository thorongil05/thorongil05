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
import DeleteIcon from "@mui/icons-material/Delete";
import { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import AddMatchDialog from "./AddMatchDialog";
import { useAuth } from "../../context/AuthContext";

function MatchesView({ selectedCompetition, teams, teamsLoading, onMatchAdded, refreshTrigger }) {
  const { user } = useAuth();
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
      .then((data) => {
        setRounds(data);
        if (data && data.length > 0) {
          setSelectedRound(data[data.length - 1]);
        } else {
          setSelectedRound("All");
        }
      })
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
  const handleDeleteMatch = async (matchId) => {
    if (!window.confirm("Are you sure you want to delete this match?")) {
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/matches/${matchId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete match");
      }

      fetchMatches();
      fetchRounds();
      if (onMatchAdded) {
        onMatchAdded();
      }
    } catch (err) {
      console.error("Error deleting match:", err);
      alert("Error deleting match: " + err.message);
    }
  };

  useEffect(() => {
    fetchRounds();
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
          {(user?.role === "admin" || user?.role === "editor") && (
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
          )}
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
              {(user?.role === "admin" || user?.role === "editor") && <TableCell align="right">Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={user ? 6 : 5} align="center">
                  Loading matches...
                </TableCell>
              </TableRow>
            )}
            {error && !loading && (
              <TableRow>
                <TableCell colSpan={user ? 6 : 5} align="center" style={{ color: "red" }}>
                  Error: {error}
                </TableCell>
              </TableRow>
            )}
            {!loading && !error && matches.length === 0 && (
              <TableRow>
                <TableCell colSpan={user ? 6 : 5} align="center">
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
                  {(user?.role === "admin" || user?.role === "editor") && (
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
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteMatch(match.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  )}
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
          if (onMatchAdded) {
            onMatchAdded();
          }
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
  onMatchAdded: PropTypes.func,
  refreshTrigger: PropTypes.number,
};

export default MatchesView;
