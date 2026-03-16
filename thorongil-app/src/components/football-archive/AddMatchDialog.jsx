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
  Alert,
} from "@mui/material";
import { useEffect } from "react";
import PropTypes from "prop-types";
import CloseIcon from "@mui/icons-material/Close";
import { useMatchForm } from "./hooks/useMatchForm";
import { ScoreSelector } from "./components/ScoreSelector";

function AddMatchDialog({
  onMatchAdded,
  teams,
  teamsLoading,
  selectedEdition,
  selectedPhase,
  selectedPhaseId,
  selectedGroupId,
  open,
  onClose,
  matchToEdit,
  defaultRound,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const {
    match,
    setMatch,
    homeTeamOptions,
    awayTeamOptions,
    isSubmitting,
    submitCompleted,
    setSubmitCompleted,
    submitError,
    addAnother,
    setAddAnother,
    roundMatches,
    handleSubmit,
    homeTeamRef,
  } = useMatchForm({
    matchToEdit,
    defaultRound,
    selectedEdition,
    selectedPhaseId,
    selectedGroupId,
    open,
    onMatchAdded,
    onClose,
    teams,
  });

  useEffect(() => {
    if (submitCompleted && !isMobile) {
      homeTeamRef.current?.focus();
      setSubmitCompleted(false);
    }
  }, [submitCompleted, isMobile, homeTeamRef, setSubmitCompleted]);

  const maxMatches = selectedPhase?.metadata?.matchesPerRound;
  const maxMatchesNum = maxMatches ? parseInt(maxMatches, 10) : null;
  const isLimitReached = !matchToEdit && maxMatchesNum && (roundMatches.length >= maxMatchesNum);
  const submitDisabled = Boolean(isSubmitting || isLimitReached || teamsLoading);

  const dialogTitle = matchToEdit ? "Edit Match" : "Add Match";

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" fullScreen={isMobile}>
      {isMobile && (
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={onClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              {dialogTitle}
            </Typography>
            <Button autoFocus color="inherit" onClick={handleSubmit} disabled={submitDisabled}>
              {matchToEdit ? "Save" : "Add"}
            </Button>
          </Toolbar>
        </AppBar>
      )}
      {!isMobile && <DialogTitle>{dialogTitle}</DialogTitle>}
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <DialogContent dividers={isMobile}>
          <EditionBanner selectedEdition={selectedEdition} />
          {isLimitReached && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                Limite raggiunto: sono già presenti {roundMatches.length} partite (su un massimo di {maxMatchesNum}) per la Giornata {match.round}.
              </Typography>
            </Alert>
          )}
          {isMobile ? (
            <MobileForm
              match={match}
              setMatch={setMatch}
              homeTeamOptions={homeTeamOptions}
              awayTeamOptions={awayTeamOptions}
              teamsLoading={teamsLoading}
              isSubmitting={isSubmitting}
              submitError={submitError}
            />
          ) : (
            <DesktopForm
              match={match}
              setMatch={setMatch}
              homeTeamOptions={homeTeamOptions}
              awayTeamOptions={awayTeamOptions}
              teamsLoading={teamsLoading}
              isSubmitting={isSubmitting}
              submitError={submitError}
              homeTeamRef={homeTeamRef}
            />
          )}
        </DialogContent>
        {!isMobile && (
          <DialogActions>
            {!matchToEdit && (
              <FormControlLabel
                control={<Checkbox checked={addAnother} onChange={(e) => setAddAnother(e.target.checked)} />}
                label="Add another"
              />
            )}
            <Button onClick={onClose} disabled={isSubmitting}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={submitDisabled}>
              {isSubmitting ? (matchToEdit ? "Updating..." : "Adding...") : (matchToEdit ? "Update Match" : "Add Match")}
            </Button>
          </DialogActions>
        )}
      </Box>
    </Dialog>
  );
}

function EditionBanner({ selectedEdition }) {
  if (selectedEdition) {
    return (
      <Box sx={{ mb: 2, p: 1.5, bgcolor: "action.hover", borderRadius: 1, border: "1px solid", borderColor: "divider" }}>
        <Typography variant="body2"><strong>Edition:</strong> {selectedEdition.name}</Typography>
      </Box>
    );
  }
  return (
    <Box sx={{ mb: 2, p: 1.5, bgcolor: "warning.light", borderRadius: 1, color: "warning.contrastText" }}>
      <Typography variant="body2"><strong>Warning:</strong> No edition selected.</Typography>
    </Box>
  );
}

EditionBanner.propTypes = {
  selectedEdition: PropTypes.shape({ name: PropTypes.string }),
};

function MobileForm({ match, setMatch, homeTeamOptions, awayTeamOptions, teamsLoading, isSubmitting, submitError }) {
  return (
    <Stack spacing={2}>
      <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2, bgcolor: 'background.paper' }}>
        <Autocomplete
          options={homeTeamOptions}
          getOptionLabel={(option) => option?.name || ""}
          isOptionEqualToValue={(option, value) => option?.id === value?.id}
          fullWidth name="homeTeam" value={match.homeTeam}
          loading={teamsLoading} disabled={teamsLoading || isSubmitting}
          onChange={(_event, newValue) => setMatch((prev) => ({ ...prev, homeTeam: newValue }))}
          renderInput={(params) => <TextField {...params} label="Home Team" required />}
          sx={{ mb: 2 }}
        />
        <ScoreSelector label="Home Score" value={match.homeTeamScore}
          onChange={(val) => setMatch(prev => ({ ...prev, homeTeamScore: val }))}
          disabled={isSubmitting}
        />
      </Box>
      <Typography align="center" variant="h6" color="text.secondary" sx={{ fontWeight: 'bold' }}>VS</Typography>
      <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2, bgcolor: 'background.paper' }}>
        <Autocomplete
          options={awayTeamOptions}
          getOptionLabel={(option) => option?.name || ""}
          isOptionEqualToValue={(option, value) => option?.id === value?.id}
          fullWidth name="awayTeam" value={match.awayTeam}
          loading={teamsLoading} disabled={teamsLoading || isSubmitting}
          onChange={(_event, newValue) => setMatch((prev) => ({ ...prev, awayTeam: newValue }))}
          renderInput={(params) => <TextField {...params} label="Away Team" required />}
          sx={{ mb: 2 }}
        />
        <ScoreSelector label="Away Score" value={match.awayTeamScore}
          onChange={(val) => setMatch(prev => ({ ...prev, awayTeamScore: val }))}
          disabled={isSubmitting}
        />
      </Box>
      <TextField
        label="Round" name="round" fullWidth value={match.round || ""}
        onChange={(event) => setMatch((prev) => ({ ...prev, round: event.target.value }))}
      />
      {submitError && (
        <Typography variant="body2" color="error" align="center">Error: {submitError}</Typography>
      )}
    </Stack>
  );
}

MobileForm.propTypes = {
  match: PropTypes.object.isRequired,
  setMatch: PropTypes.func.isRequired,
  homeTeamOptions: PropTypes.array.isRequired,
  awayTeamOptions: PropTypes.array.isRequired,
  teamsLoading: PropTypes.bool,
  isSubmitting: PropTypes.bool,
  submitError: PropTypes.string,
};

function DesktopForm({ match, setMatch, homeTeamOptions, awayTeamOptions, teamsLoading, isSubmitting, submitError, homeTeamRef }) {
  return (
    <Grid container spacing={2}>
      <Grid size={6}>
        <Autocomplete
          size="small" disablePortal options={homeTeamOptions}
          getOptionLabel={(option) => option?.name || ""}
          isOptionEqualToValue={(option, value) => option?.id === value?.id}
          fullWidth name="homeTeam" value={match.homeTeam}
          loading={teamsLoading} disabled={teamsLoading || isSubmitting}
          onChange={(_event, newValue) => setMatch((prev) => ({ ...prev, homeTeam: newValue }))}
          renderInput={(params) => (
            <TextField {...params} inputRef={homeTeamRef} label="Home Team" required autoFocus />
          )}
        />
      </Grid>
      <Grid size={6}>
        <Autocomplete
          size="small" disablePortal options={awayTeamOptions}
          getOptionLabel={(option) => option?.name || ""}
          isOptionEqualToValue={(option, value) => option?.id === value?.id}
          fullWidth name="awayTeam" value={match.awayTeam}
          loading={teamsLoading} disabled={teamsLoading || isSubmitting}
          onChange={(_event, newValue) => setMatch((prev) => ({ ...prev, awayTeam: newValue }))}
          renderInput={(params) => <TextField {...params} label="Away Team" required />}
        />
      </Grid>
      <Grid size={6}>
        <TextField
          size="small" label="Home Score" type="number" name="homeTeamScore"
          fullWidth required value={match.homeTeamScore ?? ""}
          onChange={(event) => {
            const value = event.target.value;
            setMatch((prev) => ({ ...prev, homeTeamScore: value === "" ? null : parseInt(value) }));
          }}
        />
      </Grid>
      <Grid size={6}>
        <TextField
          size="small" label="Away Score" type="number" name="awayTeamScore"
          fullWidth required value={match.awayTeamScore ?? ""}
          onChange={(event) => {
            const value = event.target.value;
            setMatch((prev) => ({ ...prev, awayTeamScore: value === "" ? null : parseInt(value) }));
          }}
        />
      </Grid>
      <Grid size={12}>
        <TextField
          size="small" label="Round" name="round" fullWidth value={match.round || ""}
          onChange={(event) => setMatch((prev) => ({ ...prev, round: event.target.value }))}
        />
      </Grid>
      {submitError && (
        <Grid size={12}>
          <Typography variant="body2" color="error">Error: {submitError}</Typography>
        </Grid>
      )}
    </Grid>
  );
}

DesktopForm.propTypes = {
  match: PropTypes.object.isRequired,
  setMatch: PropTypes.func.isRequired,
  homeTeamOptions: PropTypes.array.isRequired,
  awayTeamOptions: PropTypes.array.isRequired,
  teamsLoading: PropTypes.bool,
  isSubmitting: PropTypes.bool,
  submitError: PropTypes.string,
  homeTeamRef: PropTypes.object,
};

AddMatchDialog.propTypes = {
  onMatchAdded: PropTypes.func,
  teams: PropTypes.array.isRequired,
  teamsLoading: PropTypes.bool.isRequired,
  selectedEdition: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  }),
  selectedPhase: PropTypes.object,
  selectedPhaseId: PropTypes.number,
  selectedGroupId: PropTypes.number,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  matchToEdit: PropTypes.object,
  defaultRound: PropTypes.string,
};

export default AddMatchDialog;
