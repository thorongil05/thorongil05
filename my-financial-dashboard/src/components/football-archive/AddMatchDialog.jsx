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
import { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { useAuth } from "../../context/AuthContext";

function AddMatchDialog({
  onMatchAdded,
  teams,
  teamsLoading,
  selectedCompetition,
  open,
  onClose,
  matchToEdit,
}) {
  const { token } = useAuth();
  const homeTeamRef = useRef(null);
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
    round: "",
  });

  useEffect(() => {
    if (open) {
      if (matchToEdit) {
        setMatch({
          homeTeam: matchToEdit.homeTeam,
          awayTeam: matchToEdit.awayTeam,
          homeTeamScore: matchToEdit.homeScore,
          awayTeamScore: matchToEdit.awayScore,
          round: matchToEdit.round,
        });
        setAddAnother(false);
      } else {
        setMatch({
          homeTeam: null,
          awayTeam: null,
          homeTeamScore: null,
          awayTeamScore: null,
          round: "",
        });
        setAddAnother(false);
      }
      setSubmitError(null);
    }
  }, [open, matchToEdit]);

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
      round: match.round,
    };

    try {
      let apiUrl;
      let method;

      if (matchToEdit) {
        apiUrl = new URL(
          `${import.meta.env.VITE_SERVER_URL}/api/matches/${matchToEdit.id}`,
        );
        method = "PUT";
      } else {
        apiUrl = new URL(`${import.meta.env.VITE_SERVER_URL}/api/matches`);
        method = "POST";
      }

      const response = await fetch(apiUrl, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          ...(token && { "Authorization": `Bearer ${token}` }),
        },
        body: JSON.stringify(matchData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log(
        `Match ${matchToEdit ? "updated" : "created"} successfully:`,
        result,
      );

      // Notify parent component that a match was added/updated
      if (onMatchAdded) {
        onMatchAdded();
      }

      if (!addAnother || matchToEdit) {
        onClose();
      } else {
         // Reset form after successful submission only if adding another
          setMatch({
            homeTeam: null,
            awayTeam: null,
            homeTeamScore: null,
            awayTeamScore: null,
            round: match.round, // Keep round for convenience in batch entry
          });
          // Focus back to home team input
          setTimeout(() => {
            if (homeTeamRef.current) {
              homeTeamRef.current.focus();
            }
          }, 0);
      }
    } catch (error) {
      console.error(`Error ${matchToEdit ? "updating" : "creating"} match:`, error);
      setSubmitError(error.message || `Failed to ${matchToEdit ? "update" : "create"} match`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      transitionDuration={0}
      disableRestoreFocus
    >
      <DialogTitle>{matchToEdit ? "Edit Match" : "Add Match"}</DialogTitle>
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
                  <TextField
                    {...params}
                    inputRef={homeTeamRef}
                    label="Home Team"
                    required
                    autoFocus
                  />
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
            <Grid size={12}>
              <TextField
                size="small"
                label="Round"
                name="round"
                fullWidth
                value={match.round || ""}
                onChange={(event) => {
                  setMatch((prev) => ({
                    ...prev,
                    round: event.target.value,
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
          {!matchToEdit && (
            <FormControlLabel
              control={
                <Checkbox
                  checked={addAnother}
                  onChange={(e) => setAddAnother(e.target.checked)}
                />
              }
              label="Add another"
            />
          )}
          <Button onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? (matchToEdit ? "Updating..." : "Adding...") : (matchToEdit ? "Update Match" : "Add Match")}
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
