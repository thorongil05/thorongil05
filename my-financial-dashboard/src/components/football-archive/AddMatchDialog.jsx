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
  useMediaQuery,
  useTheme,
  Box,
  Typography,
  IconButton,
  Stack,
  AppBar,
  Toolbar,
} from "@mui/material";
import { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { useAuth } from "../../context/AuthContext";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CloseIcon from "@mui/icons-material/Close";

function ScoreSelector({ label, value, onChange, disabled }) {
  return (
    <Box sx={{ textAlign: "center", mb: 2 }}>
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
        {label}
      </Typography>
      <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
        <IconButton
          size="large"
          onClick={() => onChange(Math.max(0, (value || 0) - 1))}
          disabled={disabled || (value || 0) <= 0}
          sx={{ border: "1px solid", borderColor: "divider" }}
        >
          <RemoveIcon />
        </IconButton>
        <Typography variant="h4" sx={{ minWidth: "40px", fontWeight: "bold" }}>
          {value ?? 0}
        </Typography>
        <IconButton
          size="large"
          onClick={() => onChange((value || 0) + 1)}
          disabled={disabled}
          sx={{ border: "1px solid", borderColor: "divider" }}
        >
          <AddIcon />
        </IconButton>
      </Stack>
    </Box>
  );
}

ScoreSelector.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
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
    if (event) event.preventDefault();
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
          // Focus back to home team input if on desktop
          if (!isMobile) {
            setTimeout(() => {
              if (homeTeamRef.current) {
                homeTeamRef.current.focus();
              }
            }, 0);
          }
      }
    } catch (error) {
      console.error(`Error ${matchToEdit ? "updating" : "creating"} match:`, error);
      setSubmitError(error.message || `Failed to ${matchToEdit ? "update" : "create"} match`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const dialogTitle = matchToEdit ? "Edit Match" : "Add Match";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      fullScreen={isMobile}
    >
      {isMobile && (
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={onClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              {dialogTitle}
            </Typography>
            <Button autoFocus color="inherit" onClick={handleSubmit} disabled={isSubmitting}>
              {matchToEdit ? "Save" : "Add"}
            </Button>
          </Toolbar>
        </AppBar>
      )}
      {!isMobile && <DialogTitle>{dialogTitle}</DialogTitle>}
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <DialogContent dividers={isMobile}>
          {selectedCompetition ? (
            <Box
              sx={{
                mb: 2,
                p: 1.5,
                bgcolor: "action.hover",
                borderRadius: 1,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography variant="body2">
                <strong>Competition:</strong> {selectedCompetition.name}
              </Typography>
            </Box>
          ) : (
            <Box
              sx={{
                mb: 2,
                p: 1.5,
                bgcolor: "warning.light",
                borderRadius: 1,
                color: "warning.contrastText",
              }}
            >
              <Typography variant="body2">
                <strong>Warning:</strong> No competition selected.
              </Typography>
            </Box>
          )}

          {isMobile ? (
            <Stack spacing={2}>
              <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2, bgcolor: 'background.paper' }}>
                <Autocomplete
                  options={homeTeamOptions}
                  getOptionLabel={(option) => option?.name || ""}
                  isOptionEqualToValue={(option, value) => option?.id === value?.id}
                  fullWidth
                  name="homeTeam"
                  value={match.homeTeam}
                  loading={teamsLoading}
                  disabled={teamsLoading || isSubmitting}
                  onChange={(_event, newValue) => {
                    setMatch((prev) => ({ ...prev, homeTeam: newValue }));
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Home Team" required />
                  )}
                  sx={{ mb: 2 }}
                />
                <ScoreSelector
                  label="Home Score"
                  value={match.homeTeamScore}
                  onChange={(val) => setMatch(prev => ({ ...prev, homeTeamScore: val }))}
                  disabled={isSubmitting}
                />
              </Box>

              <Typography align="center" variant="h6" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                VS
              </Typography>

              <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2, bgcolor: 'background.paper' }}>
                <Autocomplete
                  options={awayTeamOptions}
                  getOptionLabel={(option) => option?.name || ""}
                  isOptionEqualToValue={(option, value) => option?.id === value?.id}
                  fullWidth
                  name="awayTeam"
                  value={match.awayTeam}
                  loading={teamsLoading}
                  disabled={teamsLoading || isSubmitting}
                  onChange={(_event, newValue) => {
                    setMatch((prev) => ({ ...prev, awayTeam: newValue }));
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Away Team" required />
                  )}
                  sx={{ mb: 2 }}
                />
                <ScoreSelector
                  label="Away Score"
                  value={match.awayTeamScore}
                  onChange={(val) => setMatch(prev => ({ ...prev, awayTeamScore: val }))}
                  disabled={isSubmitting}
                />
              </Box>

              <TextField
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

              {submitError && (
                <Typography variant="body2" color="error" align="center">
                  Error: {submitError}
                </Typography>
              )}
            </Stack>
          ) : (
            <Grid container spacing={2}>
              <Grid size={6}>
                <Autocomplete
                  size="small"
                  disablePortal
                  options={homeTeamOptions}
                  getOptionLabel={(option) => option?.name || ""}
                  isOptionEqualToValue={(option, value) => option?.id === value?.id}
                  fullWidth
                  name="homeTeam"
                  value={match.homeTeam}
                  loading={teamsLoading}
                  disabled={teamsLoading || isSubmitting}
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
                  isOptionEqualToValue={(option, value) => option?.id === value?.id}
                  fullWidth
                  name="awayTeam"
                  value={match.awayTeam}
                  loading={teamsLoading}
                  disabled={teamsLoading || isSubmitting}
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
                  <Typography variant="body2" color="error">
                    Error: {submitError}
                  </Typography>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        {!isMobile && (
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
        )}
      </Box>
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
  matchToEdit: PropTypes.object,
};

export default AddMatchDialog;
