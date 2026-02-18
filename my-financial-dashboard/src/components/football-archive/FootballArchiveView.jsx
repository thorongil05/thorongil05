import CompetitionSelector from "./competitions/CompetitionSelector";
import {
  Grid,
  Stack,
  Typography,
  Drawer,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Box,
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

  const viewContent = selectedCompetition ? (
    <Stack spacing={2} sx={{ flex: 1, minWidth: 0 }}>
      {/* Participants Accordion */}
      <Accordion disableGutters elevation={0} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 1 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ width: "100%" }}>
            <PeopleIcon color="action" />
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", flexGrow: 1 }}>
              {t("football.participants")}
            </Typography>
            {!teamsLoading && (
              <Chip
                label={participantCount}
                size="small"
                color="primary"
                variant="outlined"
                sx={{ fontWeight: "bold", height: 20 }}
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
          />
        </AccordionDetails>
      </Accordion>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, lg: 6 }}>
          <StandingsView
            selectedCompetition={selectedCompetition}
            refreshTrigger={refreshTrigger}
          />
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <MatchesView
            selectedCompetition={selectedCompetition}
            teams={teams}
            teamsLoading={teamsLoading}
            onMatchAdded={() => setRefreshTrigger((prev) => prev + 1)}
            refreshTrigger={refreshTrigger}
          />
        </Grid>
      </Grid>
    </Stack>
  ) : (
    <Box sx={{
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "300px",
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
        gap: isMobile ? 2 : 4,
        alignItems: "flex-start",
        p: isMobile ? 1 : 2
      }}
    >
      <CompetitionSelector
        onCompetitionSelect={handleCompetitionSelect}
        selectedCompetitionId={selectedCompetition?.id}
      />
      {viewContent}
    </Box>
  );
}

export default FootballArchiveView;
