import CompetitionSelector from "./competitions/CompetitionSelector";
import {
  Stack,
  Typography,
  Chip,
  Box,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useMediaQuery,
  useTheme,
  Tabs,
  Tab,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TeamsView from "./TeamsView";
import MatchesView from "./MatchesView";
import StandingsView from "./StandingsView";
import CompetitionProgress from "./competitions/CompetitionProgress";
import EditionSelector from "./competitions/EditionSelector";
import PhaseGroupSelector from "./competitions/PhaseGroupSelector";
import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { apiGet } from "../../utils/api";

function FootballArchiveView() {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [teams, setTeams] = useState([]);
  const [teamsLoading, setTeamsLoading] = useState(true);
  const [participantCount, setParticipantCount] = useState(0);
  const [selectedCompetition, setSelectedCompetition] = useState(null);
  const [editions, setEditions] = useState([]);
  const [selectedEdition, setSelectedEdition] = useState(null);
  const [editionsLoading, setEditionsLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [phases, setPhases] = useState([]);
  const [selectedPhaseId, setSelectedPhaseId] = useState(null);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [phasesLoading, setPhasesLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const fetchTeams = useCallback((editionId) => {
    const endpoint = editionId
      ? `/api/competitions/editions/${editionId}/teams`
      : `/api/teams`;

    apiGet(endpoint)
      .then((data) => {
        const teamsData = data.data || [];
        const count = data.metadata?.count || 0;

        let retrievedTeams = teamsData.map((element) => ({
          id: element.id,
          name: element.name,
          city: element.city,
        }));
        setTeams(retrievedTeams);
        setParticipantCount(count);
        setTeamsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching teams:", error);
        setTeamsLoading(false);
      });
  }, []);

  const handleCompetitionSelect = (competition) => {
    setSelectedCompetition(competition);
    setSelectedEdition(null);
    setEditions([]);
    setPhases([]);
    setSelectedPhaseId(null);
    setSelectedGroupId(null);
  };

  const handleEditionSelect = (edition) => {
    setSelectedEdition(edition);
    setSelectedPhaseId(null);
    setSelectedGroupId(null);
    setPhases([]);
  };

  useEffect(() => {
    if (!selectedCompetition) {
      fetchTeams();
    }
  }, [fetchTeams, selectedCompetition]);

  useEffect(() => {
    if (selectedCompetition) {
      setEditionsLoading(true);
      apiGet(`/api/competitions/${selectedCompetition.id}/editions`)
        .then((data) => {
          setEditions(data);
          if (data && data.length > 0) {
            setSelectedEdition(data[0]); // Auto-select latest
          }
          setEditionsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching editions:", error);
          setEditionsLoading(false);
        });
    }
  }, [selectedCompetition]);

  useEffect(() => {
    if (selectedEdition) {
      fetchTeams(selectedEdition.id);
      setPhasesLoading(true);
      apiGet(`/api/competitions/editions/${selectedEdition.id}/phases`)
        .then((data) => {
          setPhases(data);
          if (data && data.length > 0) {
            setSelectedPhaseId(data[0].id); // Auto-select first phase
          }
          setPhasesLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching phases:", error);
          setPhasesLoading(false);
        });
    }
  }, [selectedEdition, fetchTeams, refreshTrigger]);

  const sidebarContent = (
    <Stack spacing={2} sx={{ width: isMobile ? "100%" : "300px", flexShrink: 0 }}>
      <CompetitionSelector
        onCompetitionSelect={handleCompetitionSelect}
        selectedCompetitionId={selectedCompetition?.id}
      />
      {selectedCompetition && (
        <Stack spacing={2}>
          <EditionSelector
            editions={editions}
            selectedEditionId={selectedEdition?.id}
            onEditionSelect={handleEditionSelect}
            loading={editionsLoading}
          />
          {selectedEdition && (
            <PhaseGroupSelector
              phases={phases}
              selectedPhaseId={selectedPhaseId}
              onPhaseSelect={setSelectedPhaseId}
              selectedGroupId={selectedGroupId}
              onGroupSelect={setSelectedGroupId}
              loading={phasesLoading}
            />
          )}
        </Stack>
      )}
    </Stack>
  );

  const mainContent = selectedCompetition ? (
    <Stack spacing={2} sx={{ flex: 1, minWidth: 0, width: "100%" }}>
      <CompetitionProgress
        edition={selectedEdition}
        refreshTrigger={refreshTrigger}
      />

      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="football content tabs"
          variant={isMobile ? "fullWidth" : "standard"}
        >
          <Tab
            label={t("football.standings", "Classifica")}
            sx={{ fontWeight: "bold", textTransform: "none" }}
          />
          <Tab
            label={t("football.matches", "Partite")}
            sx={{ fontWeight: "bold", textTransform: "none" }}
          />
          <Tab
            label={t("football.participants", "Partecipanti")}
            sx={{ fontWeight: "bold", textTransform: "none" }}
          />
        </Tabs>
      </Box>

      <Box sx={{ mt: 1 }}>
        {tabValue === 0 && (
          <StandingsView
            selectedEdition={selectedEdition}
            selectedPhaseId={selectedPhaseId}
            selectedGroupId={selectedGroupId}
            refreshTrigger={refreshTrigger}
          />
        )}
        {tabValue === 1 && (
          <MatchesView
            selectedEdition={selectedEdition}
            selectedPhaseId={selectedPhaseId}
            selectedGroupId={selectedGroupId}
            teams={teams}
            teamsLoading={teamsLoading}
            onMatchAdded={() => setRefreshTrigger((prev) => prev + 1)}
            refreshTrigger={refreshTrigger}
          />
        )}
        {tabValue === 2 && (
          <TeamsView
            teams={teams}
            loading={teamsLoading}
            onTeamAdded={() => {
              if (selectedEdition) fetchTeams(selectedEdition.id);
              setRefreshTrigger((prev) => prev + 1);
            }}
            editionId={selectedEdition?.id}
            isCompact={false}
          />
        )}
      </Box>
    </Stack>
  ) : (
    <Box sx={{
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "400px",
      p: 4,
      bgcolor: "action.hover",
      borderRadius: 2,
      border: "2px dashed",
      borderColor: "divider"
    }}>
      <Typography
        variant="h5"
        align="center"
        sx={{ color: "text.secondary", maxWidth: "400px" }}
      >
        {isMobile
          ? t("football.select_competition_message_mobile", "Seleziona una competizione dal menu in alto per iniziare.")
          : t("football.select_competition_message_desktop", "Seleziona una competizione dalla lista a sinistra per visualizzare i dettagli.")}
      </Typography>
    </Box>
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        gap: isMobile ? 3 : 4,
        alignItems: "flex-start",
        p: isMobile ? 1 : 2
      }}
    >
      {sidebarContent}
      {mainContent}
    </Box>
  );
}

export default FootballArchiveView;
