import {
  Container,
  Stack,
  Typography,
  Chip,
  Box,
  useMediaQuery,
  useTheme,
  Grid,
  Tabs,
  Tab,
  CircularProgress
} from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { apiGet } from "../../utils/api";

import CompetitionSelector from "./competitions/CompetitionSelector";
import EditionSelector from "./competitions/EditionSelector";
import PhaseGroupSelector from "./competitions/PhaseGroupSelector";
import CompetitionProgress from "./competitions/CompetitionProgress";
import TeamsView from "./TeamsView";
import MatchesView from "./MatchesView";
import StandingsView from "./StandingsView";

// ==========================================
// 1. Data Loaders (The Component Matrioska)
// ==========================================

function EditionDataContainer({ competition, refreshTrigger, children }) {
  const [editions, setEditions] = useState([]);
  const [selectedEdition, setSelectedEdition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [teams, setTeams] = useState([]);
  const [participantCount, setParticipantCount] = useState(0);
  const [teamsLoading, setTeamsLoading] = useState(false);

  useEffect(() => {
    if (!competition) return;
    setLoading(true);
    apiGet(`/api/competitions/${competition.id}/editions`)
      .then((data) => {
        setEditions(data);
        if (data && data.length > 0) {
          setSelectedEdition(data[0]);
        } else {
          setSelectedEdition(null);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [competition]);

  const fetchTeams = useCallback((editionId) => {
    setTeamsLoading(true);
    const endpoint = editionId
      ? `/api/competitions/editions/${editionId}/teams`
      : `/api/teams`;

    apiGet(endpoint)
      .then((data) => {
        const teamsData = data.data || [];
        const count = data.metadata?.count || 0;
        setTeams(teamsData.map((e) => ({ id: e.id, name: e.name, city: e.city })));
        setParticipantCount(count);
      })
      .catch((err) => console.error(err))
      .finally(() => setTeamsLoading(false));
  }, []);

  useEffect(() => {
    fetchTeams(selectedEdition?.id);
  }, [selectedEdition, fetchTeams, refreshTrigger]);

  if (loading) {
    return <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}><CircularProgress /></Box>;
  }

  return children({
    editions,
    selectedEdition,
    setSelectedEdition,
    teams,
    participantCount,
    teamsLoading,
    fetchTeams
  });
}

function PhaseGroupDataContainer({ edition, refreshTrigger, children }) {
  const [phases, setPhases] = useState([]);
  const [selectedPhaseId, setSelectedPhaseId] = useState(null);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!edition) return;
    setLoading(true);
    apiGet(`/api/competitions/editions/${edition.id}/phases`)
      .then((data) => {
        setPhases(data);
        if (data && data.length > 0) {
          setSelectedPhaseId(data[0].id);
        } else {
          setSelectedPhaseId(null);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [edition, refreshTrigger]);

  const handlePhaseChange = (phaseId) => {
    setSelectedPhaseId(phaseId);
    setSelectedGroupId(null);
  };

  const selectedPhase = phases.find((p) => p.id === selectedPhaseId);
  const isPendingGroupSelection = selectedPhase?.type === "GROUP" && !selectedGroupId;
  const isStable = !loading && !isPendingGroupSelection;

  if (loading) {
    return <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}><CircularProgress /></Box>;
  }

  return children({
    phases,
    selectedPhaseId,
    handlePhaseChange,
    selectedGroupId,
    setSelectedGroupId,
    isStable
  });
}

// ==========================================
// 2. Presentation Layouts
// ==========================================

function ArchiveLayout({ sidebarContent, mainContent }) {
  return (
    <Stack direction={{ xs: "column", md: "row" }} spacing={4} alignItems="flex-start">
      <Box sx={{ width: { xs: "100%", md: "300px" }, flexShrink: 0 }}>
        {sidebarContent}
      </Box>
      <Box sx={{ flex: 1, minWidth: 0, width: "100%" }}>
        {mainContent}
      </Box>
    </Stack>
  );
}

// ==========================================
// 3. Main View Root
// ==========================================

export default function FootballArchiveView() {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [selectedCompetition, setSelectedCompetition] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [tabValue, setTabValue] = useState(0);

  const [globalTeams, setGlobalTeams] = useState([]);
  const [globalTeamsLoading, setGlobalTeamsLoading] = useState(true);

  useEffect(() => {
    if (!selectedCompetition) {
      setGlobalTeamsLoading(true);
      apiGet("/api/teams")
        .then((data) => {
          setGlobalTeams(data.data?.map(e => ({ id: e.id, name: e.name, city: e.city })) || []);
        })
        .finally(() => setGlobalTeamsLoading(false));
    }
  }, [selectedCompetition]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // The sidebar content is standard across states, but dynamic based on active data
  const renderSidebar = (editionProps = null, phaseProps = null) => (
    <Stack spacing={2} sx={{ width: "100%" }}>
      <CompetitionSelector
        onCompetitionSelect={setSelectedCompetition}
        selectedCompetitionId={selectedCompetition?.id}
      />
      {selectedCompetition && editionProps && (
        <Stack spacing={2}>
          <EditionSelector
            editions={editionProps.editions}
            selectedEditionId={editionProps.selectedEdition?.id}
            onEditionSelect={editionProps.setSelectedEdition}
          />
          {editionProps.selectedEdition && phaseProps && (
            <PhaseGroupSelector
              phases={phaseProps.phases}
              selectedPhaseId={phaseProps.selectedPhaseId}
              onPhaseSelect={phaseProps.handlePhaseChange}
              selectedGroupId={phaseProps.selectedGroupId}
              onGroupSelect={phaseProps.setSelectedGroupId}
            />
          )}
        </Stack>
      )}
    </Stack>
  );

  const renderMainContent = (editionProps, phaseProps) => {
    const { selectedEdition, teams, teamsLoading, fetchTeams } = editionProps;
    const { phases, selectedPhaseId, selectedGroupId, isStable } = phaseProps;

    return (
      <Stack spacing={2} sx={{ flex: 1, minWidth: 0, width: "100%" }}>
        <CompetitionProgress edition={selectedEdition} refreshTrigger={refreshTrigger} />

        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="football content tabs"
            variant={isMobile ? "fullWidth" : "standard"}
          >
            <Tab label={t("football.standings", "Classifica")} sx={{ fontWeight: "bold", textTransform: "none" }} />
            <Tab label={t("football.matches", "Partite")} sx={{ fontWeight: "bold", textTransform: "none" }} />
            <Tab label={t("football.participants", "Partecipanti")} sx={{ fontWeight: "bold", textTransform: "none" }} />
          </Tabs>
        </Box>

        <Box sx={{ mt: 1 }}>
          {tabValue === 0 && (
            isStable ? (
              <StandingsView
                selectedEdition={selectedEdition}
                selectedPhaseId={selectedPhaseId}
                selectedGroupId={selectedGroupId}
                refreshTrigger={refreshTrigger}
              />
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>
            )
          )}
          {tabValue === 1 && (
            isStable ? (
              <MatchesView
                selectedEdition={selectedEdition}
                selectedPhaseId={selectedPhaseId}
                selectedGroupId={selectedGroupId}
                phases={phases}
                teams={teams}
                teamsLoading={teamsLoading}
                onMatchAdded={() => setRefreshTrigger((prev) => prev + 1)}
                refreshTrigger={refreshTrigger}
              />
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>
            )
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
              refreshTrigger={refreshTrigger}
            />
          )}
        </Box>
      </Stack>
    );
  };

  const renderEmptyState = () => (
    <Stack spacing={2} sx={{ flex: 1, minWidth: 0, width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={0} variant={isMobile ? "fullWidth" : "standard"}>
          <Tab label={t("football.participants", "Partecipanti")} sx={{ fontWeight: "bold", textTransform: "none" }} />
        </Tabs>
      </Box>
      <Box sx={{ mt: 1 }}>
        <TeamsView teams={globalTeams} loading={globalTeamsLoading} />
      </Box>
    </Stack>
  );

  return (
    <Container maxWidth={false} sx={{ py: 4, px: { xs: 2, md: 4 } }}>
      <Stack spacing={4}>
        <Stack direction="row" spacing={2} alignItems="center">
          <EmojiEventsIcon sx={{ fontSize: 40, color: "primary.main" }} />
          <Box>
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
              {t("football.archive", "Archivio Calcistico")}
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
              <Chip label={t("football.amateur", "Serie Dilettantistiche")} size="small" variant="outlined" color="primary" />
            </Stack>
          </Box>
        </Stack>

        {!selectedCompetition ? (
          <ArchiveLayout sidebarContent={renderSidebar()} mainContent={renderEmptyState()} />
        ) : (
          <EditionDataContainer competition={selectedCompetition} refreshTrigger={refreshTrigger}>
            {(editionProps) => {
              if (!editionProps.selectedEdition) {
                return <ArchiveLayout sidebarContent={renderSidebar(editionProps)} mainContent={<Box />} />
              }
              return (
                <PhaseGroupDataContainer edition={editionProps.selectedEdition} refreshTrigger={refreshTrigger}>
                  {(phaseProps) => (
                    <ArchiveLayout
                      sidebarContent={renderSidebar(editionProps, phaseProps)}
                      mainContent={renderMainContent(editionProps, phaseProps)}
                    />
                  )}
                </PhaseGroupDataContainer>
              );
            }}
          </EditionDataContainer>
        )}
      </Stack>
    </Container>
  );
}
