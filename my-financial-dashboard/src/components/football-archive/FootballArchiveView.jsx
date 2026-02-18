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
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TeamsView from "./TeamsView";
import MatchesView from "./MatchesView";
import StandingsView from "./StandingsView";
import { useState, useEffect, useCallback } from "react";
import PeopleIcon from "@mui/icons-material/People";
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
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchTeams = useCallback((competition) => {
    const endpoint = competition
      ? `/api/competitions/${competition.id}/teams`
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
  };

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  useEffect(() => {
    if (selectedCompetition) {
      fetchTeams(selectedCompetition);
    }
  }, [selectedCompetition, fetchTeams]);

  const participantsContent = (
    <>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: isMobile ? 0 : 2 }}>
        <PeopleIcon color="action" fontSize="small" />
        <Typography variant="subtitle2" sx={{ fontWeight: "bold", flexGrow: 1 }}>
          {t("football.participants")}
        </Typography>
        {!teamsLoading && (
          <Chip
            label={participantCount}
            size="small"
            color="primary"
            variant="outlined"
            sx={{ fontWeight: "bold", height: 18, fontSize: "0.7rem" }}
          />
        )}
      </Stack>
      <Box sx={{ flex: 1, overflow: isMobile ? "visible" : "auto", pr: 0.5 }}>
        <TeamsView
          teams={teams}
          loading={teamsLoading}
          onTeamAdded={() => {
            fetchTeams(selectedCompetition);
            setRefreshTrigger((prev) => prev + 1);
          }}
          competitionId={selectedCompetition?.id}
          isCompact={true}
        />
      </Box>
    </>
  );

  const sidebarContent = (
    <Stack spacing={2} sx={{ width: isMobile ? "100%" : "300px", flexShrink: 0 }}>
      <CompetitionSelector
        onCompetitionSelect={handleCompetitionSelect}
        selectedCompetitionId={selectedCompetition?.id}
      />
      {selectedCompetition && (
        isMobile ? (
          <Accordion disableGutters sx={{ borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ width: "100%" }}>
                <PeopleIcon color="action" fontSize="small" />
                <Typography variant="subtitle2" sx={{ fontWeight: "bold", flexGrow: 1 }}>
                  {t("football.participants")}
                </Typography>
                {!teamsLoading && (
                  <Chip
                    label={participantCount}
                    size="small"
                    variant="outlined"
                    sx={{ fontWeight: "bold", height: 18, fontSize: "0.7rem" }}
                  />
                )}
              </Stack>
            </AccordionSummary>
            <AccordionDetails sx={{ pt: 0 }}>
              <TeamsView
                teams={teams}
                loading={teamsLoading}
                onTeamAdded={() => {
                  fetchTeams(selectedCompetition);
                  setRefreshTrigger((prev) => prev + 1);
                }}
                competitionId={selectedCompetition?.id}
                isCompact={true}
              />
            </AccordionDetails>
          </Accordion>
        ) : (
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              borderRadius: 2,
              height: "calc(100vh - 250px)",
              display: "flex",
              flexDirection: "column"
            }}
          >
            {participantsContent}
          </Paper>
        )
      )}
    </Stack>
  );

  const mainContent = selectedCompetition ? (
    <Stack spacing={3} sx={{ flex: 1, minWidth: 0, width: "100%" }}>
      <StandingsView
        selectedCompetition={selectedCompetition}
        refreshTrigger={refreshTrigger}
      />
      <MatchesView
        selectedCompetition={selectedCompetition}
        teams={teams}
        teamsLoading={teamsLoading}
        onMatchAdded={() => setRefreshTrigger((prev) => prev + 1)}
        refreshTrigger={refreshTrigger}
      />
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
