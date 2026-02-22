import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Slider,
  useMediaQuery,
  useTheme,
  Box,
  Button,
  TableSortLabel,
  Stack,
  Tooltip,
  IconButton,
} from "@mui/material";
import PropTypes from "prop-types";
import { useEffect, useState, useMemo } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { useTranslation } from "react-i18next";
import { apiGet } from "../../utils/api";

function StandingsView({ selectedEdition, selectedPhaseId, selectedGroupId, refreshTrigger }) {
  const { t } = useTranslation();
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [roundsInterval, setRoundsInterval] = useState([1, 0]);
  const [sliderValue, setSliderValue] = useState([1, 0]);
  const [maxRound, setMaxRound] = useState(0);
  const [lastFetchedInterval, setLastFetchedInterval] = useState(null);

  // Sorting state
  const [sortBy, setSortBy] = useState("points");
  const [sortOrder, setSortOrder] = useState("desc");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  // Default collapsed for mobile/tablet, expanded for desktop
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setIsExpanded(!isTablet);
  }, [isTablet]);

  // Column visibility logic
  const showP2 = isExpanded; // P, W, D, L
  const showP3 = isExpanded; // GF, GA, GD

  const handleIntervalChange = (_event, newValue) => {
    setRoundsInterval(newValue);
  };

  const handleSliderChange = (_event, newValue) => {
    setSliderValue(newValue);
  };

  const handleSort = (property) => {
    const isAsc = sortBy === property && sortOrder === "asc";
    setSortOrder(isAsc ? "desc" : "asc");
    setSortBy(property);
  };

  const resetSorting = () => {
    setSortBy("points");
    setSortOrder("desc");
  };

  const sortedStandings = useMemo(() => {
    if (!standings || standings.length === 0) return [];

    const result = [...standings];
    result.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];

      // Handle team name specially for alphabetical sort
      if (sortBy === "teamName") {
        aVal = (aVal || "").toLowerCase();
        bVal = (bVal || "").toLowerCase();
      }

      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;

      // Secondary sort by points if not already sorting by points
      if (sortBy !== "points") {
        if (a.points < b.points) return 1;
        if (a.points > b.points) return -1;
      }

      // Tertiary sort by goal difference
      if (sortBy !== "goalDifference") {
        if (a.goalDifference < b.goalDifference) return 1;
        if (a.goalDifference > b.goalDifference) return -1;
      }

      return 0;
    });
    return result;
  }, [standings, sortBy, sortOrder]);

  useEffect(() => {
    if (!selectedEdition) {
      setStandings([]);
      return;
    }

    // Skip redundant fetch if interval hasn't changed
    if (
      lastFetchedInterval &&
      roundsInterval[0] === lastFetchedInterval[0] &&
      roundsInterval[1] === lastFetchedInterval[1]
    ) {
      return;
    }

    setLoading(true);
    setError(null);

    const params = new URLSearchParams();
    if (roundsInterval[1] > 0) {
      params.append("startInterval", roundsInterval[0]);
      params.append("endInterval", roundsInterval[1]);
    }

    if (selectedPhaseId) params.append("phaseId", selectedPhaseId);
    if (selectedGroupId) params.append("groupId", selectedGroupId);

    const queryStr = params.toString() ? `?${params.toString()}` : "";

    apiGet(`/api/competitions/editions/${selectedEdition.id}/standings${queryStr}`)
      .then((result) => {
        setStandings(result.standings);
        setMaxRound(result.totalRounds);

        // If this was the first load (endInterval was 0), 
        // initialize the slider and interval to the full range
        if (roundsInterval[1] === 0) {
          const fullRange = [1, result.totalRounds];
          setSliderValue(fullRange);
          setRoundsInterval(fullRange);
          setLastFetchedInterval(fullRange);
        } else {
          setLastFetchedInterval(roundsInterval);
        }

        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching standings:", error);
        setError(error.message);
        setLoading(false);
      });
  }, [selectedEdition, refreshTrigger, roundsInterval, lastFetchedInterval, selectedPhaseId, selectedGroupId]);

  // Reset state when edition changes
  useEffect(() => {
    setRoundsInterval([1, 0]);
    setSliderValue([1, 0]);
    setLastFetchedInterval(null);
    setMaxRound(0);
    resetSorting();
  }, [selectedEdition, selectedPhaseId, selectedGroupId]);

  if (!selectedEdition) {
    return null;
  }

  return (
    <TableContainer
      component={Paper}
      variant="outlined"
      sx={{
        borderRadius: 2,
        overflow: "auto",
        "&::-webkit-scrollbar": {
          width: "6px",
          height: "6px",
        },
        "&::-webkit-scrollbar-track": {
          background: "transparent",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "rgba(0,0,0,0.1)",
          borderRadius: "10px",
        },
        "&::-webkit-scrollbar-thumb:hover": {
          background: "rgba(0,0,0,0.2)",
        },
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ p: 2, borderBottom: "1px solid", borderColor: "divider", bgcolor: "background.paper" }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          {t("football.standings")}
        </Typography>
        <Stack direction="row" spacing={1}>
          {(sortBy !== "points" || sortOrder !== "desc") && (
            <Tooltip title={t("common.reset_sort")}>
              <Box component="span">
                <IconButton size="small" onClick={resetSorting} sx={{ border: "1px solid", borderColor: "divider" }}>
                  <RestartAltIcon fontSize="small" />
                </IconButton>
              </Box>
            </Tooltip>
          )}
          <Button
            size="small"
            variant="outlined"
            onClick={() => setIsExpanded(!isExpanded)}
            startIcon={isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            sx={{ borderRadius: 2, textTransform: "none", fontSize: "0.75rem" }}
          >
            {isExpanded ? t("common.less", "Less") : t("common.more", "More")}
          </Button>
        </Stack>
      </Stack>

      <Box sx={{ px: 4, py: 1, bgcolor: "background.paper" }}>
        <Slider
          value={sliderValue}
          onChange={handleSliderChange}
          onChangeCommitted={handleIntervalChange}
          valueLabelDisplay="auto"
          min={1}
          max={maxRound}
          size="small"
        />
        <Typography variant="caption" color="text.secondary" align="center" display="block">
          {t("football.rounds_range", "Rounds Range")}: {sliderValue[0]} - {sliderValue[1]}
        </Typography>
      </Box>

      <Table
        size="small"
        aria-label="standings table"
        sx={{
          minWidth: isExpanded ? 800 : "100%",
          tableLayout: "fixed"
        }}
      >
        <TableHead>
          <TableRow sx={{ bgcolor: "action.hover" }}>
            <TableCell sx={{ width: "50px", fontWeight: "bold" }}>Pos</TableCell>
            <TableCell sx={{ fontWeight: "bold", width: "auto", minWidth: 150 }}>
              <TableSortLabel
                active={sortBy === "teamName"}
                direction={sortBy === "teamName" ? sortOrder : "asc"}
                onClick={() => handleSort("teamName")}
              >
                Team
              </TableSortLabel>
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: "bold", width: "50px" }}>
              <TableSortLabel
                active={sortBy === "played"}
                direction={sortBy === "played" ? sortOrder : "desc"}
                onClick={() => handleSort("played")}
              >
                P
              </TableSortLabel>
            </TableCell>
            {showP2 && (
              <>
                <TableCell align="center" sx={{ fontWeight: "bold", width: "50px" }}>
                  <TableSortLabel
                    active={sortBy === "won"}
                    direction={sortBy === "won" ? sortOrder : "desc"}
                    onClick={() => handleSort("won")}
                  >
                    W
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold", width: "50px" }}>
                  <TableSortLabel
                    active={sortBy === "drawn"}
                    direction={sortBy === "drawn" ? sortOrder : "desc"}
                    onClick={() => handleSort("drawn")}
                  >
                    D
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold", width: "50px" }}>
                  <TableSortLabel
                    active={sortBy === "lost"}
                    direction={sortBy === "lost" ? sortOrder : "desc"}
                    onClick={() => handleSort("lost")}
                  >
                    L
                  </TableSortLabel>
                </TableCell>
              </>
            )}
            {showP3 && (
              <>
                <TableCell align="center" sx={{ fontWeight: "bold", width: "50px" }}>
                  <TableSortLabel
                    active={sortBy === "goalsFor"}
                    direction={sortBy === "goalsFor" ? sortOrder : "desc"}
                    onClick={() => handleSort("goalsFor")}
                  >
                    GF
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold", width: "50px" }}>
                  <TableSortLabel
                    active={sortBy === "goalsAgainst"}
                    direction={sortBy === "goalsAgainst" ? sortOrder : "desc"}
                    onClick={() => handleSort("goalsAgainst")}
                  >
                    GA
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold", width: "50px" }}>
                  <TableSortLabel
                    active={sortBy === "goalDifference"}
                    direction={sortBy === "goalDifference" ? sortOrder : "desc"}
                    onClick={() => handleSort("goalDifference")}
                  >
                    GD
                  </TableSortLabel>
                </TableCell>
              </>
            )}
            <TableCell
              align="center"
              sx={{
                fontWeight: "bold",
                bgcolor: "primary.soft",
                color: "primary.main",
                width: "60px"
              }}
            >
              <TableSortLabel
                active={sortBy === "points"}
                direction={sortBy === "points" ? sortOrder : "desc"}
                onClick={() => handleSort("points")}
              >
                Pts
              </TableSortLabel>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading && (
            <TableRow>
              <TableCell colSpan={isExpanded ? 10 : 4} align="center" sx={{ py: 4 }}>
                <Typography variant="body2" color="text.secondary">Loading standings...</Typography>
              </TableCell>
            </TableRow>
          )}
          {error && (
            <TableRow>
              <TableCell colSpan={isExpanded ? 10 : 4} align="center" sx={{ py: 4 }}>
                <Typography variant="body2" color="error">Error: {error}</Typography>
              </TableCell>
            </TableRow>
          )}
          {!loading && !error && sortedStandings.length === 0 && (
            <TableRow>
              <TableCell colSpan={isExpanded ? 10 : 4} align="center" sx={{ py: 4 }}>
                <Typography variant="body2" color="text.secondary">No standings available</Typography>
              </TableCell>
            </TableRow>
          )}
          {!loading &&
            !error &&
            sortedStandings.map((team, index) => (
              <TableRow key={team.teamId} hover>
                <TableCell sx={{ color: "text.secondary" }}>{index + 1}</TableCell>
                <TableCell sx={{ fontWeight: "medium" }}>{team.teamName}</TableCell>
                <TableCell align="center">{team.played}</TableCell>
                {showP2 && (
                  <>
                    <TableCell align="center">{team.won}</TableCell>
                    <TableCell align="center">{team.drawn}</TableCell>
                    <TableCell align="center">{team.lost}</TableCell>
                  </>
                )}
                {showP3 && (
                  <>
                    <TableCell align="center">{team.goalsFor}</TableCell>
                    <TableCell align="center">{team.goalsAgainst}</TableCell>
                    <TableCell align="center">{team.goalDifference}</TableCell>
                  </>
                )}
                <TableCell
                  align="center"
                  sx={{
                    bgcolor: "action.selected",
                    fontWeight: "bold",
                    color: "primary.main"
                  }}
                >
                  {team.points}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

StandingsView.propTypes = {
  selectedEdition: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string,
  }),
  selectedPhaseId: PropTypes.number,
  selectedGroupId: PropTypes.number,
  refreshTrigger: PropTypes.number,
};

export default StandingsView;
