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
import { apiGet, apiPost, apiPut } from "../../utils/api";

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
        <TextField
          type="number"
          size="small"
          value={value ?? ""}
          onChange={(e) => {
            const val = e.target.value;
            onChange(val === "" ? 0 : parseInt(val));
          }}
          disabled={disabled}
          inputProps={{
            min: 0,
            style: { textAlign: 'center', fontWeight: 'bold', fontSize: '1.5rem' }
          }}
          sx={{ width: '80px' }}
        />
        <IconButton
          size="large"
          onClick={() => onChange(value === null ? 0 : value + 1)}
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
  selectedEdition,
  open,
  onClose,
  matchToEdit,
  defaultRound,
}) {
  const { token } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const homeTeamRef = useRef(null);
  let [homeTeamOptions, setHomeTeamOptions] = useState([]);
  let [awayTeamOptions, setAwayTeamOptions] = useState([]);
  let [isSubmitting, setIsSubmitting] = useState(false);
  let [submitCompleted, setSubmitCompleted] = useState(false);
  let [submitError, setSubmitError] = useState(null);
  let [addAnother, setAddAnother] = useState(false);
  let [match, setMatch] = useState({
    homeTeam: null,
    awayTeam: null,
    homeTeamScore: null,
    awayTeamScore: null,
    round: "",
  });
  const [roundMatches, setRoundMatches] = useState([]);
  const [roundRefreshTrigger, setRoundRefreshTrigger] = useState(0);

  // Fetch matches for the current round to filter out teams that already played
  useEffect(() => {
    const roundToFetch = match.round?.toString().trim();
    if (open && selectedEdition && roundToFetch && roundToFetch !== "All") {
      const params = new URLSearchParams({
        editionId: selectedEdition.id,
        round: roundToFetch
      });
      apiGet(`/api/matches?${params}`)
        .then(response => {
          const data = response.data || response;
          setRoundMatches(data);
        })
        .catch(err => console.error("Error fetching round matches:", err));
    } else {
      setRoundMatches([]);
    }
  }, [open, selectedEdition, match.round, roundRefreshTrigger]);

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
          round: defaultRound || "",
        });
        setAddAnother(false);
      }
      setSubmitError(null);
    }
  }, [open, matchToEdit, defaultRound]);

  // Update options when team selections or round matches change
  useEffect(() => {
    // Get IDs of teams that already played in this round (excluding current match being edited)
    const playedTeamIds = new Set(
      roundMatches
        .filter(rm => !matchToEdit || rm.id !== matchToEdit.id)
        .flatMap(rm => [
          rm.homeTeamId || rm.homeTeam?.id,
          rm.awayTeamId || rm.awayTeam?.id
        ])
        .filter(id => id !== undefined && id !== null)
    );

    // Filter out the selected away team AND teams that already played this round
    setHomeTeamOptions(
      teams.filter((team) =>
        (!match.awayTeam || team.id !== match.awayTeam.id) &&
        !playedTeamIds.has(team.id)
      ),
    );

    // Filter out the selected home team AND teams that already played this round
    setAwayTeamOptions(
      teams.filter((team) =>
        (!match.homeTeam || team.id !== match.homeTeam.id) &&
        !playedTeamIds.has(team.id)
      ),
    );
  }, [match.awayTeam, match.homeTeam, teams, roundMatches, matchToEdit]);

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
      editionId: selectedEdition.id,
      round: match.round,
    };

    try {
      let result;

      if (matchToEdit) {
        result = await apiPut(`/api/matches/${matchToEdit.id}`, matchData);
      } else {
        result = await apiPost(`/api/matches`, matchData);
      }

      console.log(
        `Match ${matchToEdit ? "updated" : "created"} successfully:`,
        result,
      );

      // Notify parent component that a match was added/updated
      if (onMatchAdded) {
        onMatchAdded(match.round);
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
        // Set submit completed to true to trigger focus back to home team input and other reset logic
        setSubmitCompleted(true);
        // Trigger a refresh of the round matches to update team options
        setRoundRefreshTrigger(prev => prev + 1);
      }
    } catch (error) {
      console.error(`Error ${matchToEdit ? "updating" : "creating"} match:`, error);
      setSubmitError(error.message || `Failed to ${matchToEdit ? "update" : "create"} match`);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (submitCompleted && !isMobile) {
      homeTeamRef.current?.focus();
      setSubmitCompleted(false);
    }
  }, [submitCompleted, isMobile]);

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
          {selectedEdition ? (
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
                <strong>Edition:</strong> {selectedEdition.name}
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
                <strong>Warning:</strong> No edition selected.
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
  selectedEdition: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  }),
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  matchToEdit: PropTypes.object,
  defaultRound: PropTypes.string,
};

export default AddMatchDialog;
