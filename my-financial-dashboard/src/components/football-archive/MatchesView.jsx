import {
  Paper,
  Stack,
  TableContainer,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useState } from "react";
import PropTypes from "prop-types";
import MatchdayBuilder from "./MatchdayBuilder";
import EditMatchDialog from "./EditMatchDialog";
import { useAuth } from "../../context/AuthContext";
import MobileMatchesView from "./matches/MobileMatchesView";
import DesktopMatchesView from "./matches/DesktopMatchesView";
import MatchesToolbar from "./matches/MatchesToolbar";
import { useMatchesViewData } from "./hooks/useMatchesViewData";

function MatchesView({
  selectedEdition,
  selectedPhaseId,
  selectedGroupId,
  teams,
  onMatchAdded,
}) {
  const { user } = useAuth();
  
  const [matchDialogOpen, setMatchDialogOpen] = useState(false);
  const [builderOpen, setBuilderOpen] = useState(false);
  const [matchToEdit, setMatchToEdit] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const {
    matches,
    matchesCount,
    loading,
    error,
    rounds,
    selectedRound,
    setSelectedRound,
    selectedTeamId,
    setSelectedTeamId,
    sortBy,
    sortOrder,
    lastUsedRound,
    setLastUsedRound,
    handleResetFilters,
    handleRequestSort,
    handleDeleteMatch,
    fetchMatches,
    fetchRounds
  } = useMatchesViewData({
    selectedEdition,
    selectedPhaseId,
    selectedGroupId,
    onMatchAdded,
  });

  const handleEditMatch = (match) => {
    setMatchToEdit(match);
    setMatchDialogOpen(true);
  };

  return (
    <Stack spacing={2}>
      <TableContainer
        component={Paper}
        variant="outlined"
        sx={{
          borderRadius: 2,
          overflow: "auto",
          borderColor: "divider",
          width: "100%",
          "&::-webkit-scrollbar": { height: "6px" },
          "&::-webkit-scrollbar-thumb": { background: "rgba(0,0,0,0.1)", borderRadius: "10px" },
        }}
      >
        <MatchesToolbar 
          isMobile={isMobile}
          loading={loading}
          matchesCount={matchesCount}
          selectedRound={selectedRound}
          setSelectedRound={setSelectedRound}
          selectedEdition={selectedEdition}
          rounds={rounds}
          user={user}
          setBuilderOpen={setBuilderOpen}
          selectedTeamId={selectedTeamId}
          setSelectedTeamId={setSelectedTeamId}
          teams={teams}
          sortBy={sortBy}
          handleResetFilters={handleResetFilters}
        />

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

      <EditMatchDialog
        open={matchDialogOpen}
        onClose={() => { setMatchDialogOpen(false); setMatchToEdit(null); }}
        onMatchUpdated={(round) => {
          if (round) setLastUsedRound(round);
          fetchMatches();
          fetchRounds();
          if (onMatchAdded) onMatchAdded();
        }}
        matchToEdit={matchToEdit}
        selectedEdition={selectedEdition}
      />

      <MatchdayBuilder
        open={builderOpen}
        onClose={() => setBuilderOpen(false)}
        onMatchesCreated={(round) => {
          if (round) setLastUsedRound(round);
          fetchMatches();
          fetchRounds();
          if (onMatchAdded) onMatchAdded();
        }}
        teams={teams}
        selectedEdition={selectedEdition}
        selectedPhaseId={selectedPhaseId}
        selectedGroupId={selectedGroupId}
        defaultRound={lastUsedRound}
      />
    </Stack>
  );
}

MatchesView.propTypes = {
  selectedEdition: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  }),
  selectedPhaseId: PropTypes.number,
  selectedGroupId: PropTypes.number,
  teams: PropTypes.array.isRequired,
  onMatchAdded: PropTypes.func,
};

export default MatchesView;
