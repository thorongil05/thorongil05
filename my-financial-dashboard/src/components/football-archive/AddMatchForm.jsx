import { Autocomplete, Grid, TextField } from "@mui/material";
import { useEffect, useState } from "react";

function AddMatchForm({ onMatchAdded, teams, teamsLoading }) {
  let [homeTeamOptions, setHomeTeamOptions] = useState([]);
  let [awayTeamOptions, setAwayTeamOptions] = useState([]);
  let [isSubmitting, setIsSubmitting] = useState(false);
  let [submitError, setSubmitError] = useState(null);
  let [submitSuccess, setSubmitSuccess] = useState(false);
  let [match, setMatch] = useState({
    homeTeam: null,
    awayTeam: null,
    homeTeamScore: null,
    awayTeamScore: null,
  });

  // Update options when team selections change
  useEffect(() => {
    // Filter out the selected away team from home options
    setHomeTeamOptions(
      teams.filter(
        (team) => !match.awayTeam || team.id !== match.awayTeam.id,
      ),
    );
  }, [match.awayTeam, teams]);

  useEffect(() => {
    // Filter out the selected home team from away options
    setAwayTeamOptions(
      teams.filter(
        (team) => !match.homeTeam || team.id !== match.homeTeam.id,
      ),
    );
  }, [match.homeTeam, teams]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(false);

    if (!match.homeTeam || !match.awayTeam) {
      setSubmitError("Please select both home and away teams");
      return;
    }

    if (match.homeTeamScore === null || match.awayTeamScore === null) {
      setSubmitError("Please enter scores for both teams");
      return;
    }

    setIsSubmitting(true);

    // Prepare match data for API submission
    const matchData = {
      homeTeamId: match.homeTeam.id,
      awayTeamId: match.awayTeam.id,
      homeGoals: match.homeTeamScore,
      awayGoals: match.awayTeamScore,
      matchDate: new Date(),
      competitionId: 4,
      // TODO: Add matchDate, competitionId, and stadium when form is updated
    };

    try {
      const apiUrl = new URL(`${import.meta.env.VITE_SERVER_URL}/api/matches`);
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(matchData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Match created successfully:", result);
      setSubmitSuccess(true);

      // Reset form after successful submission
      setMatch({
        homeTeam: null,
        awayTeam: null,
        homeTeamScore: null,
        awayTeamScore: null,
      });

      // Notify parent component that a match was added
      if (onMatchAdded) {
        onMatchAdded();
      }

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Error creating match:", error);
      setSubmitError(error.message || "Failed to create match");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={1}>
        <Grid size={4}>
          <Autocomplete
            size="small"
            disablePortal
            options={homeTeamOptions}
            getOptionLabel={(option) => option?.name || ""}
            isOptionEqualToValue={(option, value) => option?.id === value?.id}
            sx={{ width: 300 }}
            name="homeTeam"
            value={match.homeTeam}
            loading={teamsLoading}
            disabled={teamsLoading}
            onChange={(_event, newValue) => {
              setMatch((prev) => ({ ...prev, homeTeam: newValue }));
            }}
            renderInput={(params) => (
              <TextField {...params} label="Home Team" />
            )}
          ></Autocomplete>
        </Grid>
        <Grid size={4}>
          <Autocomplete
            size="small"
            disablePortal
            options={awayTeamOptions}
            getOptionLabel={(option) => option?.name || ""}
            isOptionEqualToValue={(option, value) => option?.id === value?.id}
            sx={{ width: 300 }}
            name="awayTeam"
            value={match.awayTeam}
            loading={teamsLoading}
            disabled={teamsLoading}
            onChange={(_event, newValue) => {
              setMatch((prev) => ({ ...prev, awayTeam: newValue }));
            }}
            renderInput={(params) => (
              <TextField {...params} label="Away Team" />
            )}
          ></Autocomplete>
        </Grid>
        <Grid size={2}>
          <TextField
            size="small"
            label="Home Score"
            type="number"
            name="homeTeamScore"
            value={match.homeTeamScore ?? ""}
            onChange={(event) => {
              const value = event.target.value;
              setMatch((prev) => ({
                ...prev,
                homeTeamScore: value === "" ? null : parseInt(value),
              }));
            }}
          ></TextField>
        </Grid>
        <Grid size={2}>
          <TextField
            size="small"
            label="Away Score"
            type="number"
            name="awayTeamScore"
            value={match.awayTeamScore ?? ""}
            onChange={(event) => {
              const value = event.target.value;
              setMatch((prev) => ({
                ...prev,
                awayTeamScore: value === "" ? null : parseInt(value),
              }));
            }}
          ></TextField>
        </Grid>
        <Grid size={12}>
          <button
            type="submit"
            style={{ padding: "8px 16px", marginTop: "16px" }}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Adding Match..." : "Add Match"}
          </button>
        </Grid>
        {submitError && (
          <Grid size={12}>
            <div style={{ color: "red", marginTop: "8px" }}>
              Error: {submitError}
            </div>
          </Grid>
        )}
        {submitSuccess && (
          <Grid size={12}>
            <div style={{ color: "green", marginTop: "8px" }}>
              Match added successfully!
            </div>
          </Grid>
        )}
      </Grid>
    </form>
  );
}

export default AddMatchForm;
