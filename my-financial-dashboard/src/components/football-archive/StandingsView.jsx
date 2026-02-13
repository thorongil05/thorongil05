import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Collapse,
  useMediaQuery,
  useTheme,
  Box,
  Button,
} from "@mui/material";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useTranslation } from "react-i18next";

function StandingsView({ selectedCompetition, refreshTrigger }) {
  const { t } = useTranslation();
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const showFullDetails = !isMobile || isExpanded;

  useEffect(() => {
    if (!selectedCompetition) {
      setStandings([]);
      return;
    }

    setLoading(true);
    setError(null);

    const apiUrl = new URL(
      `${import.meta.env.VITE_SERVER_URL}/api/competitions/${selectedCompetition.id}/standings`,
    );

    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setStandings(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching standings:", error);
        setError(error.message);
        setLoading(false);
      });
  }, [selectedCompetition, refreshTrigger]);

  if (!selectedCompetition) {
    return null;
  }

  return (
    <TableContainer component={Paper}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 1 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          {t("football.standings")}
        </Typography>
        {isMobile && (
          <Button 
            size="small" 
            onClick={() => setIsExpanded(!isExpanded)}
            startIcon={isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          >
            {isExpanded ? t("football.collapse") : t("football.expand")}
          </Button>
        )}
      </Box>
      <Table size="small" aria-label="standings table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: "40px" }}>Pos</TableCell>
            <TableCell>Team</TableCell>
            <TableCell align="center">P</TableCell>
            {showFullDetails && (
              <>
                <TableCell align="center">W</TableCell>
                <TableCell align="center">D</TableCell>
                <TableCell align="center">L</TableCell>
                <TableCell align="center">GF</TableCell>
                <TableCell align="center">GA</TableCell>
                <TableCell align="center">GD</TableCell>
              </>
            )}
            <TableCell align="center">Pts</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading && (
            <TableRow>
              <TableCell colSpan={showFullDetails ? 10 : 4} align="center">
                Loading standings...
              </TableCell>
            </TableRow>
          )}
          {error && (
            <TableRow>
              <TableCell colSpan={10} align="center" style={{ color: "red" }}>
                Error: {error}
              </TableCell>
            </TableRow>
          )}
          {!loading && !error && standings.length === 0 && (
            <TableRow>
              <TableCell colSpan={showFullDetails ? 10 : 4} align="center">
                No standings available
              </TableCell>
            </TableRow>
          )}
          {!loading &&
            !error &&
            standings.map((team, index) => (
              <TableRow key={team.teamId}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{team.teamName}</TableCell>
                <TableCell align="center">{team.played}</TableCell>
                {showFullDetails && (
                  <>
                    <TableCell align="center">{team.won}</TableCell>
                    <TableCell align="center">{team.drawn}</TableCell>
                    <TableCell align="center">{team.lost}</TableCell>
                    <TableCell align="center">{team.goalsFor}</TableCell>
                    <TableCell align="center">{team.goalsAgainst}</TableCell>
                    <TableCell align="center">{team.goalDifference}</TableCell>
                  </>
                )}
                <TableCell align="center">
                  <strong>{team.points}</strong>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

StandingsView.propTypes = {
  selectedCompetition: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string,
  }),
  refreshTrigger: PropTypes.number,
};

export default StandingsView;
