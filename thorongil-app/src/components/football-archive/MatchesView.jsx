import { useState } from "react";
import PropTypes from "prop-types";
import MatchdayBuilder from "./MatchdayBuilder";
import MatchDialog from "./MatchDialog";
import { useAuth } from "../../context/AuthContext";
import { UserRoles } from "../../constants/roles";
import MobileMatchesView from "./matches/MobileMatchesView";
import DesktopMatchesView from "./matches/DesktopMatchesView";
import MatchesToolbar from "./matches/MatchesToolbar";
import { useMatchesViewData } from "./hooks/useMatchesViewData";
import { MATCH_DIALOG_MODE as MODE } from "./constants/matchDialogModes";

function MatchesView({ selectedEdition, selectedPhaseId, selectedGroupId, teams, onMatchAdded }) {
  const { user } = useAuth();
  const canManage = user?.role === UserRoles.ADMIN || user?.role === UserRoles.EDITOR;
  const [matchDialogOpen, setMatchDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState(MODE.UPDATE_SCORE);
  const [builderOpen, setBuilderOpen] = useState(false);
  const [matchToEdit, setMatchToEdit] = useState(null);
  const data = useMatchesViewData({ selectedEdition, selectedPhaseId, selectedGroupId, onMatchAdded });
  const handleEditMatch = (match, mode) => { setMatchToEdit(match); setDialogMode(mode); setMatchDialogOpen(true); };
  const onMatchUpdated = (round) => { if (round) data.setLastUsedRound(round); data.fetchMatches(); data.fetchRounds(); onMatchAdded?.(); };
  const toolbarProps = {
    loading: data.loading, matchesCount: data.matchesCount, selectedRound: data.selectedRound,
    setSelectedRound: data.setSelectedRound, rounds: data.rounds, selectedEdition, user, setBuilderOpen,
    selectedTeamId: data.selectedTeamId, setSelectedTeamId: data.setSelectedTeamId,
    teams, sortBy: data.sortBy, handleResetFilters: data.handleResetFilters,
  };
  const viewProps = {
    matches: data.matches, loading: data.loading, error: data.error,
    handleEditMatch, handleDeleteMatch: data.handleDeleteMatch, selectedTeamId: data.selectedTeamId,
  };
  return (
    <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 flex flex-col h-full">
      <MatchesToolbar {...toolbarProps} />
      <div className="flex-1 min-h-0 overflow-auto">
        <div className="hidden sm:block">
          <DesktopMatchesView {...viewProps} sortBy={data.sortBy} sortOrder={data.sortOrder} handleRequestSort={data.handleRequestSort} />
        </div>
        <div className="sm:hidden"><MobileMatchesView {...viewProps} /></div>
      </div>
      {canManage && (
        <button onClick={() => { setMatchToEdit(null); setDialogMode(MODE.INSERT); setMatchDialogOpen(true); }} disabled={!selectedEdition}
          className="sm:hidden fixed bottom-[5.5rem] right-6 z-[51] w-14 h-14 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-2xl rounded-full shadow-lg transition-all flex items-center justify-center">
          +
        </button>
      )}
      <MatchDialog
        open={matchDialogOpen} mode={dialogMode} matchToEdit={matchToEdit}
        onClose={() => { setMatchDialogOpen(false); setMatchToEdit(null); }}
        onMatchUpdated={onMatchUpdated}
        teams={teams} selectedEdition={selectedEdition}
        selectedPhaseId={selectedPhaseId} selectedGroupId={selectedGroupId}
      />
      <MatchdayBuilder open={builderOpen} onClose={() => setBuilderOpen(false)} onMatchesCreated={onMatchUpdated}
        teams={teams} selectedEdition={selectedEdition} selectedPhaseId={selectedPhaseId}
        selectedGroupId={selectedGroupId} defaultRound={data.lastUsedRound}
      />
    </div>
  );
}

MatchesView.propTypes = {
  selectedEdition: PropTypes.shape({ id: PropTypes.number, name: PropTypes.string }),
  selectedPhaseId: PropTypes.number, selectedGroupId: PropTypes.number,
  teams: PropTypes.array.isRequired, onMatchAdded: PropTypes.func,
};

export default MatchesView;
