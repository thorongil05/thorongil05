import {
  Autocomplete,
  Grid,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";

function AddMatchDialog({
  onMatchAdded,
  teams,
  teamsLoading,
  selectedCompetition,
  open,
  onClose,
}) {
  let [homeTeamOptions, setHomeTeamOptions] = useState([]);
  let [awayTeamOptions, setAwayTeamOptions] = useState([]);
  let [isSubmitting, setIsSubmitting] = useState(false);
  let [submitError, setSubmitError] = useState(null);
  let [addAnother, setAddAnother] = useState(false);
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
      teams.filter((team) => !match.awayTeam || team.id !== match.awayTeam.id),
    );
  }, [match.awayTeam, teams]);

  useEffect(() => {
    // Filter out the selected home team from away options
    setAwayTeamOptions(
      teams.filter((team) => !match.homeTeam || team.id !== match.homeTeam.id),
    );
  }, [match.homeTeam, teams]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError(null);

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
      matchDate: new Date().toISOString(),
      competitionId: selectedCompetition?.id || null,
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
      
      if (!addAnother) {
        onClose();
      }
    } catch (error) {
      console.error("Error creating match:", error);
      setSubmitError(error.message || "Failed to create match");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add Match</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {selectedCompetition ? (
            <div
              style={{
                marginBottom: "16px",
                padding: "8px",
                backgroundColor: "#f5f5f5",
                borderRadius: "4px",
              }}
            >
              <strong>Competition:</strong> {selectedCompetition.name}
            </div>
          ) : (
            <div
              style={{
                marginBottom: "16px",
                padding: "8px",
                backgroundColor: "#fff3cd",
                borderRadius: "4px",
                color: "#856404",
              }}
            >
              <strong>Warning:</strong> No competition selected. Matches will be
              added without competition context.
            </div>
          )}
          <Grid container spacing={2}>
            <Grid size={6}>
              <Autocomplete
                size="small"
                disablePortal
                options={homeTeamOptions}
                getOptionLabel={(option) => option?.name || ""}
                isOptionEqualToValue={(option, value) =>
                  option?.id === value?.id
                }
                fullWidth
                name="homeTeam"
                value={match.homeTeam}
                loading={teamsLoading}
                disabled={teamsLoading}
                onChange={(_event, newValue) => {
                  setMatch((prev) => ({ ...prev, homeTeam: newValue }));
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Home Team" required />
                )}
              />
            </Grid>
            <Grid size={6}>
              <Autocomplete
                size="small"
                disablePortal
                options={awayTeamOptions}
                getOptionLabel={(option) => option?.name || ""}
                isOptionEqualToValue={(option, value) =>
                  option?.id === value?.id
                }
                fullWidth
                name="awayTeam"
                value={match.awayTeam}
                loading={teamsLoading}
                disabled={teamsLoading}
                onChange={(_event, newValue) => {
                  setMatch((prev) => ({ ...prev, awayTeam: newValue }));
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Away Team" required />
                )}
              />
            </Grid>
            <Grid size={6}>
              <TextField
                size="small"
                label="Home Score"
                type="number"
                name="homeTeamScore"
                fullWidth
                required
                value={match.homeTeamScore ?? ""}
                onChange={(event) => {
                  const value = event.target.value;
                  setMatch((prev) => ({
                    ...prev,
                    homeTeamScore: value === "" ? null : parseInt(value),
                  }));
                }}
              />
            </Grid>
            <Grid size={6}>
              <TextField
                size="small"
                label="Away Score"
                type="number"
                name="awayTeamScore"
                fullWidth
                required
                value={match.awayTeamScore ?? ""}
                onChange={(event) => {
                  const value = event.target.value;
                  setMatch((prev) => ({
                    ...prev,
                    awayTeamScore: value === "" ? null : parseInt(value),
                  }));
                }}
              />
            </Grid>
            {submitError && (
              <Grid size={12}>
                <div style={{ color: "red", marginTop: "8px" }}>
                  Error: {submitError}
                </div>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <FormControlLabel
            control={
              <Checkbox
                checked={addAnother}
                onChange={(e) => setAddAnother(e.target.checked)}
              />
            }
            label="Add another"
          />
          <Button onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add Match"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

AddMatchDialog.propTypes = {
  onMatchAdded: PropTypes.func,
  teams: PropTypes.array.isRequired,
  teamsLoading: PropTypes.bool.isRequired,
  selectedCompetition: PropTypes.object,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AddMatchDialog;
