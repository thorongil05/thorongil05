import { Box, CircularProgress } from "@mui/material";
import StandingsView from "./StandingsView";
import MatchesView from "./MatchesView";
import TeamsView from "./TeamsView";
import CompetitionProgress from "./competitions/CompetitionProgress";
import PropTypes from "prop-types";

const Spinner = () => (
  <Box sx={{ display: "flex", justifyContent: "center", p: 6 }}>
    <CircularProgress />
  </Box>
);

export default function ArchiveContent({ data, activeTab }) {
  const {
    selectedEdition, selectedPhaseId, selectedGroupId,
    phases, teams, teamsLoading, fetchTeams,
    refreshTrigger, triggerRefresh, isReady,
  } = data;

  if (!selectedEdition) {
    return (
      <div className="flex items-center justify-center h-full text-slate-500">
        <p className="text-lg">Seleziona un campionato per iniziare</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <CompetitionProgress edition={selectedEdition} refreshTrigger={refreshTrigger} />

      {!isReady && activeTab !== "participants" && <Spinner />}

      {isReady && activeTab === "standings" && (
        <StandingsView
          selectedEdition={selectedEdition}
          selectedPhaseId={selectedPhaseId}
          selectedGroupId={selectedGroupId}
          refreshTrigger={refreshTrigger}
        />
      )}

      {isReady && activeTab === "matches" && (
        <MatchesView
          selectedEdition={selectedEdition}
          selectedPhaseId={selectedPhaseId}
          selectedGroupId={selectedGroupId}
          phases={phases}
          teams={teams}
          teamsLoading={teamsLoading}
          onMatchAdded={triggerRefresh}
          refreshTrigger={refreshTrigger}
        />
      )}

      {activeTab === "participants" && (
        <TeamsView
          teams={teams}
          loading={teamsLoading}
          onTeamAdded={() => { fetchTeams(selectedEdition?.id); triggerRefresh(); }}
          editionId={selectedEdition?.id}
          refreshTrigger={refreshTrigger}
        />
      )}
    </div>
  );
}

ArchiveContent.propTypes = {
  data: PropTypes.object.isRequired,
  activeTab: PropTypes.string.isRequired,
};
