import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";

function StandingsView({ selectedCompetition, refreshTrigger }) {
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Typography variant="h6" sx={{ p: 2 }}>
        Standings
      </Typography>
      <Table size="small" aria-label="standings table">
        <TableHead>
          <TableRow>
            <TableCell>Pos</TableCell>
            <TableCell>Team</TableCell>
            <TableCell align="center">P</TableCell>
            <TableCell align="center">W</TableCell>
            <TableCell align="center">D</TableCell>
            <TableCell align="center">L</TableCell>
            <TableCell align="center">GF</TableCell>
            <TableCell align="center">GA</TableCell>
            <TableCell align="center">GD</TableCell>
            <TableCell align="center">Pts</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading && (
            <TableRow>
              <TableCell colSpan={10} align="center">
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
              <TableCell colSpan={10} align="center">
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
                <TableCell align="center">{team.won}</TableCell>
                <TableCell align="center">{team.drawn}</TableCell>
                <TableCell align="center">{team.lost}</TableCell>
                <TableCell align="center">{team.goalsFor}</TableCell>
                <TableCell align="center">{team.goalsAgainst}</TableCell>
                <TableCell align="center">{team.goalDifference}</TableCell>
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
