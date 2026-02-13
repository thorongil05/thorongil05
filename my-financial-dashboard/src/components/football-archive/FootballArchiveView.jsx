import CompetitionSelector from "./CompetitionSelector";
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
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TeamsView from "./TeamsView";
import MatchesView from "./MatchesView";
import StandingsView from "./StandingsView";
import { useState, useEffect, useCallback } from "react";
import PeopleIcon from "@mui/icons-material/People";
import { useTranslation } from "react-i18next";

function FootballArchiveView() {
  const { t } = useTranslation();
  const [teams, setTeams] = useState([]);
  const [teamsLoading, setTeamsLoading] = useState(true);
  const [participantCount, setParticipantCount] = useState(0);
  const [selectedCompetition, setSelectedCompetition] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchTeams = useCallback((competition) => {
    let apiUrl;
    if (competition) {
      apiUrl = new URL(
        `${import.meta.env.VITE_SERVER_URL}/api/competitions/${competition.id}/teams`,
      );
    } else {
      apiUrl = new URL(`${import.meta.env.VITE_SERVER_URL}/api/teams`);
    }

    fetch(apiUrl)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        // Handle new response format: { data: [...], metadata: { count: ... } }
        const teamsData = data.data || [];
        const count = data.metadata?.count || 0;

        let retrievedTeams = teamsData.map((element) => {
          return {
            id: element.id,
            name: element.name,
            city: element.city,
          };
        });
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
  }, []);

  useEffect(() => {
    if (selectedCompetition) {
      fetchTeams(selectedCompetition);
    }
  }, [selectedCompetition, fetchTeams]);

  return (
    <>
      <CompetitionSelector
        onCompetitionSelect={handleCompetitionSelect}
        selectedCompetitionId={selectedCompetition?.id}
      />

      {selectedCompetition ? (
        <Stack spacing={2}>
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
              ></TeamsView>
            </AccordionDetails>
          </Accordion>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <StandingsView
                selectedCompetition={selectedCompetition}
                refreshTrigger={refreshTrigger}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
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
        <Typography
          variant="h5"
          align="center"
          style={{ marginTop: "40px", color: "#666" }}
        >
          {t("football.select_competition_message", "Please select a competition from the side menu to view teams and matches.")}
        </Typography>
      )}
    </>
  );
}

export default FootballArchiveView;
