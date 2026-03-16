import { useState } from "react";
import PropTypes from "prop-types";
import MatchdayBuilder from "./MatchdayBuilder";
import EditMatchDialog from "./EditMatchDialog";
import { useAuth } from "../../context/AuthContext";
import MobileMatchesView from "./matches/MobileMatchesView";
import DesktopMatchesView from "./matches/DesktopMatchesView";
import MatchesToolbar from "./matches/MatchesToolbar";
import { useMatchesViewData } from "./hooks/useMatchesViewData";

function MatchesView({ selectedEdition, selectedPhaseId, selectedGroupId, teams, onMatchAdded }) {
  const { user } = useAuth();
  const [matchDialogOpen, setMatchDialogOpen] = useState(false);
  const [builderOpen, setBuilderOpen] = useState(false);
  const [matchToEdit, setMatchToEdit] = useState(null);

  const data = useMatchesViewData({ selectedEdition, selectedPhaseId, selectedGroupId, onMatchAdded });
  const handleEditMatch = (match) => { setMatchToEdit(match); setMatchDialogOpen(true); };

  const toolbarProps = {
    loading: data.loading, matchesCount: data.matchesCount,
    selectedRound: data.selectedRound, setSelectedRound: data.setSelectedRound,
    rounds: data.rounds, selectedEdition, user, setBuilderOpen,
    selectedTeamId: data.selectedTeamId, setSelectedTeamId: data.setSelectedTeamId,
    teams, sortBy: data.sortBy, handleResetFilters: data.handleResetFilters,
  };

  const viewProps = {
    matches: data.matches, loading: data.loading, error: data.error,
    handleEditMatch, handleDeleteMatch: data.handleDeleteMatch, selectedTeamId: data.selectedTeamId,
  };

  return (
    <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800">
      <MatchesToolbar {...toolbarProps} />
      <div className="hidden sm:block">
        <DesktopMatchesView {...viewProps} sortBy={data.sortBy} sortOrder={data.sortOrder} handleRequestSort={data.handleRequestSort} />
      </div>
      <div className="sm:hidden">
        <MobileMatchesView {...viewProps} />
      </div>
      <EditMatchDialog
        open={matchDialogOpen}
        onClose={() => { setMatchDialogOpen(false); setMatchToEdit(null); }}
        onMatchUpdated={(round) => { if (round) data.setLastUsedRound(round); data.fetchMatches(); data.fetchRounds(); onMatchAdded?.(); }}
        matchToEdit={matchToEdit} selectedEdition={selectedEdition}
      />
      <MatchdayBuilder
        open={builderOpen} onClose={() => setBuilderOpen(false)}
        onMatchesCreated={(round) => { if (round) data.setLastUsedRound(round); data.fetchMatches(); data.fetchRounds(); onMatchAdded?.(); }}
        teams={teams} selectedEdition={selectedEdition} selectedPhaseId={selectedPhaseId}
        selectedGroupId={selectedGroupId} defaultRound={data.lastUsedRound}
      />
    </div>
  );
}

MatchesView.propTypes = {
  selectedEdition: PropTypes.shape({ id: PropTypes.number, name: PropTypes.string }),
  selectedPhaseId: PropTypes.number,
  selectedGroupId: PropTypes.number,
  teams: PropTypes.array.isRequired,
  onMatchAdded: PropTypes.func,
};

export default MatchesView;
