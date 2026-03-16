import { Box, CircularProgress } from "@mui/material";
import StandingsView from "./StandingsView";
import MatchesView from "./MatchesView";
import TeamsView from "./TeamsView";
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
      <div className="flex items-center justify-center flex-1 text-slate-500">
        <p className="text-lg">Seleziona un campionato per iniziare</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
      <div className={`flex-1 min-h-0 px-6 py-6 ${activeTab === "participants" ? "overflow-y-auto" : "overflow-hidden"}`}>

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
    </div>
  );
}

ArchiveContent.propTypes = {
  data: PropTypes.object.isRequired,
  activeTab: PropTypes.string.isRequired,
};
