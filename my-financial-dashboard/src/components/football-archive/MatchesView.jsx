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
  TableSortLabel,
  useTheme,
  useMediaQuery,
  Box,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import AddMatchDialog from "./AddMatchDialog";
import { useAuth } from "../../context/AuthContext";
import { UserRoles } from "../../constants/roles";
import { useTranslation } from "react-i18next";

function MatchesView({
  selectedCompetition,
  teams,
  teamsLoading,
  onMatchAdded,
  refreshTrigger,
}) {
  const { t } = useTranslation();
  const { user, token } = useAuth();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [matchDialogOpen, setMatchDialogOpen] = useState(false);
  const [matchToEdit, setMatchToEdit] = useState(null);
  const [rounds, setRounds] = useState([]);
  const [selectedRound, setSelectedRound] = useState("All");
  const [selectedTeamId, setSelectedTeamId] = useState("All");
  const [sortBy, setSortBy] = useState("match_date");
  const [sortOrder, setSortOrder] = useState("desc");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
        if (selectedRound === "All" && data && data.length > 0) {
          setSelectedRound(data[data.length - 1]);
        } else if (!data || data.length === 0) {
          setSelectedRound("All");
        }
      })
      .catch((err) => console.error("Error fetching rounds:", err));
  }, [selectedCompetition, refreshTrigger]);

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
    if (selectedTeamId && selectedTeamId !== "All") {
      params.teamId = selectedTeamId;
    }
    if (sortBy) {
      params.sortBy = sortBy;
      params.sortOrder = sortOrder;
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
  }, [selectedCompetition, selectedRound, selectedTeamId, sortBy, sortOrder, refreshTrigger]);

  const handleResetFilters = () => {
    setSelectedRound("All");
    setSelectedTeamId("All");
    setSortBy("match_date");
    setSortOrder("desc");
    // This will trigger fetchMatches and fetchRounds
    // fetchRounds will then set the latest round because selectedRound is "All"
  };

  const handleRequestSort = (property) => {
    const isAsc = sortBy === property && sortOrder === "asc";
    setSortOrder(isAsc ? "desc" : "asc");
    setSortBy(property);
  };
  const handleDeleteMatch = async (matchId) => {
    if (!window.confirm(t("football.confirm_delete_match", "Are you sure you want to delete this match?"))) {
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
      alert(t("football.error_deleting_match", { defaultValue: "Error deleting match: {{message}}", message: err.message }));
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
        direction={isMobile ? "column" : "row"}
        justifyContent="space-between"
        alignItems={isMobile ? "flex-start" : "center"}
        spacing={2}
        sx={{ mb: 2 }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          {t("football.matches")}
        </Typography>
        <Stack direction={isMobile ? "column" : "row"} spacing={1} sx={{ width: isMobile ? "100%" : "auto" }}>
          <FormControl size="small" sx={{ minWidth: isMobile ? "100%" : 120 }}>
            <InputLabel id="round-select-label">{t("football.round", "Round")}</InputLabel>
            <Select
              labelId="round-select-label"
              id="round-select"
              value={selectedRound}
              label={t("football.round", "Round")}
              onChange={(e) => setSelectedRound(e.target.value)}
              disabled={!selectedCompetition}
            >
              <MenuItem value="All">{t("football.all_rounds", "All Rounds")}</MenuItem>
              {rounds.map((round) => (
                <MenuItem key={round} value={round}>
                  {round}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: isMobile ? "100%" : 150 }}>
            <InputLabel 
              id="team-select-label"
              sx={{ color: selectedTeamId !== "All" ? "secondary.main" : "inherit" }}
            >
              {t("football.team", "Team")}
            </InputLabel>
            <Select
              labelId="team-select-label"
              id="team-select"
              value={selectedTeamId}
              label={t("football.team", "Team")}
              onChange={(e) => setSelectedTeamId(e.target.value)}
              disabled={!selectedCompetition}
            >
              <MenuItem value="All">{t("football.all_teams", "All Teams")}</MenuItem>
              {teams.map((team) => (
                <MenuItem key={team.id} value={team.id}>
                  {team.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button 
            size="small" 
            onClick={handleResetFilters}
            disabled={selectedRound === "All" && selectedTeamId === "All" && sortBy === "match_date"}
            fullWidth={isMobile}
          >
            {t("common.reset", "Reset")}
          </Button>
          {(user?.role === UserRoles.ADMIN || user?.role === UserRoles.EDITOR) && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                setMatchToEdit(null);
                setMatchDialogOpen(true);
              }}
              disabled={!selectedCompetition}
              fullWidth={isMobile}
            >
              {t("football.add_match", "Add Match")}
            </Button>
          )}
        </Stack>
      </Stack>
      <TableContainer component={Paper}>
        <Table size="small" aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell sortDirection={sortBy === "round" ? sortOrder : false}>
                <TableSortLabel
                  active={sortBy === "round"}
                  direction={sortBy === "round" ? sortOrder : "asc"}
                  onClick={() => handleRequestSort("round")}
                >
                  {t("football.round", "Round")}
                </TableSortLabel>
              </TableCell>
              <TableCell>{t("football.home_team", "Home Team")}</TableCell>
              <TableCell>{t("football.away_team", "Away Team")}</TableCell>
              <TableCell colSpan={2} align="center">{t("football.score", "Score")}</TableCell>
              {(user?.role === UserRoles.ADMIN || user?.role === UserRoles.EDITOR) && <TableCell align="right">{t("common.actions", "Actions")}</TableCell>}
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
                  <TableCell
                    sx={{
                      fontWeight: match.homeTeam?.id === Number(selectedTeamId) ? "bold" : "normal",
                      color: match.homeTeam?.id === Number(selectedTeamId) ? "secondary.main" : "inherit",
                    }}
                  >
                    {match.homeTeam?.name || "Unknown"}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: match.awayTeam?.id === Number(selectedTeamId) ? "bold" : "normal",
                      color: match.awayTeam?.id === Number(selectedTeamId) ? "secondary.main" : "inherit",
                    }}
                  >
                    {match.awayTeam?.name || "Unknown"}
                  </TableCell>
                  <TableCell colSpan={2} align="center">{match.homeScore} - {match.awayScore}</TableCell>
                  {(user?.role === UserRoles.ADMIN || user?.role === UserRoles.EDITOR) && (
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
