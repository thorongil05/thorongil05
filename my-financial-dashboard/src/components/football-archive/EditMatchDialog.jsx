import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    useMediaQuery,
    useTheme,
    Box,
    Typography,
    IconButton,
    Stack,
    AppBar,
    Toolbar,
    TextField,
    Alert,
    Grid,
    Divider
} from "@mui/material";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CloseIcon from "@mui/icons-material/Close";
import { apiPut } from "../../utils/api";

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
                    disabled={disabled}
                    sx={{ border: "1px solid", borderColor: "divider" }}
                >
                    <RemoveIcon />
                </IconButton>
                <TextField
                    type="number"
                    size="small"
                    placeholder="-"
                    value={value ?? ""}
                    onChange={(e) => {
                        const val = e.target.value;
                        onChange(val === "" ? null : parseInt(val));
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

function EditMatchDialog({
    open,
    onClose,
    onMatchUpdated,
    matchToEdit,
    selectedEdition
}) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const [match, setMatch] = useState({
        homeScore: null,
        awayScore: null,
        round: "",
        matchDate: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (open && matchToEdit) {
            setMatch({
                homeScore: matchToEdit.homeScore,
                awayScore: matchToEdit.awayScore,
                round: matchToEdit.round || "",
                matchDate: matchToEdit.matchDate ? matchToEdit.matchDate.split('T')[0] : ""
            });
            setError(null);
        }
    }, [open, matchToEdit]);

    const handleSubmit = async (event) => {
        if (event) event.preventDefault();
        setIsSubmitting(true);
        setError(null);

        const matchData = {
            ...matchToEdit,
            homeGoals: match.homeScore,
            awayGoals: match.awayScore,
            round: match.round,
            matchDate: match.matchDate ? new Date(match.matchDate).toISOString() : matchToEdit.matchDate,
            homeTeamId: matchToEdit.homeTeam?.id || matchToEdit.homeTeamId,
            awayTeamId: matchToEdit.awayTeam?.id || matchToEdit.awayTeamId,
        };

        try {
            await apiPut(`/api/matches/${matchToEdit.id}`, matchData);
            onMatchUpdated(match.round);
            onClose();
        } catch (err) {
            console.error("Error updating match:", err);
            setError("Failed to update match.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!matchToEdit) return null;

    const dialogTitle = "Aggiorna Risultato";

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
                        <IconButton edge="start" color="inherit" onClick={onClose}>
                            <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6">
                            {dialogTitle}
                        </Typography>
                        <Button color="inherit" onClick={handleSubmit} disabled={isSubmitting}>
                            SALVA
                        </Button>
                    </Toolbar>
                </AppBar>
            )}

            {!isMobile && <DialogTitle>{dialogTitle}</DialogTitle>}

            <DialogContent dividers={isMobile}>
                <Stack spacing={3} sx={{ mt: isMobile ? 0 : 1 }}>
                    {error && <Alert severity="error">{error}</Alert>}

                    {/* Teams Header (Labels Only) */}
                    <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 2, textAlign: 'center' }}>
                        <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{matchToEdit.homeTeam?.name}</Typography>
                            </Box>
                            <Typography variant="h5" color="text.secondary">VS</Typography>
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{matchToEdit.awayTeam?.name}</Typography>
                            </Box>
                        </Stack>
                        <Typography variant="caption" color="text.secondary">
                            {selectedEdition?.name} - Giornata {match.round}
                        </Typography>
                    </Box>

                    {/* Score Selectors */}
                    <Stack direction={isMobile ? "column" : "row"} spacing={isMobile ? 2 : 4} justifyContent="center">
                        <ScoreSelector
                            label="Gol Casa"
                            value={match.homeScore}
                            onChange={(val) => setMatch(prev => ({ ...prev, homeScore: val }))}
                            disabled={isSubmitting}
                        />
                        <ScoreSelector
                            label="Gol Trasferta"
                            value={match.awayScore}
                            onChange={(val) => setMatch(prev => ({ ...prev, awayScore: val }))}
                            disabled={isSubmitting}
                        />
                    </Stack>

                    <Divider />

                    {/* Additional Info */}
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextField
                                label="Giornata"
                                value={match.round}
                                onChange={(e) => setMatch(prev => ({ ...prev, round: e.target.value }))}
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="Data"
                                type="date"
                                value={match.matchDate}
                                onChange={(e) => setMatch(prev => ({ ...prev, matchDate: e.target.value }))}
                                fullWidth
                                size="small"
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                    </Grid>
                </Stack>
            </DialogContent>

            {!isMobile && (
                <DialogActions>
                    <Button onClick={onClose} color="inherit">Annulla</Button>
                    <Button variant="contained" onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? "Salvataggio..." : "Salva Risultato"}
                    </Button>
                </DialogActions>
            )}
        </Dialog>
    );
}

EditMatchDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onMatchUpdated: PropTypes.func.isRequired,
    matchToEdit: PropTypes.object,
    selectedEdition: PropTypes.object
};

export default EditMatchDialog;
