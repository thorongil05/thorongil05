import {
  Paper,
  Stack,
  TableContainer,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import AddMatchDialog from "./AddMatchDialog";
import { useAuth } from "../../context/AuthContext";
import { UserRoles } from "../../constants/roles";
import { useTranslation } from "react-i18next";
import { apiGet, apiDelete } from "../../utils/api";
import MobileMatchesView from "./matches/MobileMatchesView";
import DesktopMatchesView from "./matches/DesktopMatchesView";

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
  const [lastUsedRound, setLastUsedRound] = useState("");

  useEffect(() => {
    if (selectedRound && selectedRound !== "All") {
      setLastUsedRound(selectedRound);
    }
  }, [selectedRound]);

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
    apiGet(`/api/matches/rounds?${urlSearchParams}`)
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

    apiGet(`/api/matches?${urlSearchParams}`)
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
      await apiDelete(`/api/matches/${matchId}`);
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

  const handleEditMatch = (match) => {
    setMatchToEdit(match);
    setMatchDialogOpen(true);
  };

  useEffect(() => {
    fetchRounds();
  }, [fetchRounds]);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  return (
    <Stack>
      <TableContainer component={Paper}>
        <Stack
          direction={isMobile ? "column" : "row"}
          justifyContent="space-between"
          alignItems={isMobile ? "flex-start" : "center"}
          spacing={2}
          sx={{ p: 1 }}
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

        {isMobile ? (
          <MobileMatchesView
            matches={matches}
            loading={loading}
            error={error}
            handleEditMatch={handleEditMatch}
            handleDeleteMatch={handleDeleteMatch}
            selectedTeamId={selectedTeamId}
          />
        ) : (
          <DesktopMatchesView
            matches={matches}
            loading={loading}
            error={error}
            sortBy={sortBy}
            sortOrder={sortOrder}
            handleRequestSort={handleRequestSort}
            handleEditMatch={handleEditMatch}
            handleDeleteMatch={handleDeleteMatch}
            selectedTeamId={selectedTeamId}
          />
        )}
      </TableContainer>

      <AddMatchDialog
        open={matchDialogOpen}
        onClose={() => {
          setMatchDialogOpen(false);
          setMatchToEdit(null);
        }}
        onMatchAdded={(round) => {
          if (round) {
            setLastUsedRound(round);
          }
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
        defaultRound={lastUsedRound}
      />
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
