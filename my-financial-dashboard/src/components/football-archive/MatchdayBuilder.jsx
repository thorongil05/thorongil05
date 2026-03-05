import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Stack,
    Chip,
    IconButton,
    AppBar,
    Toolbar,
    useMediaQuery,
    useTheme,
    Divider,
    Paper,
    TextField,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Alert
} from "@mui/material";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import CloseIcon from "@mui/icons-material/Close";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { apiPost } from "../../utils/api";

function MatchdayBuilder({
    open,
    onClose,
    onMatchesCreated,
    teams,
    selectedEdition,
    selectedPhaseId,
    selectedGroupId,
    defaultRound
}) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const [round, setRound] = useState(defaultRound || "");
    const [availableTeams, setAvailableTeams] = useState([]);
    const [selectedForPairing, setSelectedForPairing] = useState(null);
    const [pairs, setPairs] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (open) {
            setAvailableTeams([...teams]);
            setPairs([]);
            setSelectedForPairing(null);
            setRound(defaultRound || "");
            setError(null);
        }
    }, [open, teams, defaultRound]);

    const handleTeamClick = (team) => {
        if (selectedForPairing === null) {
            setSelectedForPairing(team);
        } else if (selectedForPairing.id === team.id) {
            setSelectedForPairing(null);
        } else {
            // Create a pair
            setPairs([...pairs, { home: selectedForPairing, away: team }]);
            setAvailableTeams(availableTeams.filter(t => t.id !== team.id && t.id !== selectedForPairing.id));
            setSelectedForPairing(null);
        }
    };

    const removePair = (index) => {
        const pair = pairs[index];
        setPairs(pairs.filter((_, i) => i !== index));
        setAvailableTeams([...availableTeams, pair.home, pair.away]);
    };

    const resetBuilder = () => {
        setAvailableTeams([...teams]);
        setPairs([]);
        setSelectedForPairing(null);
    };

    const handleSave = async () => {
        if (!round) {
            setError("Please specify a round number/name");
            return;
        }
        if (pairs.length === 0) {
            setError("Create at least one match pair");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        const matchesData = pairs.map(pair => ({
            homeTeamId: pair.home.id,
            awayTeamId: pair.away.id,
            homeGoals: null,
            awayGoals: null,
            matchDate: new Date().toISOString(),
            editionId: selectedEdition.id,
            phaseId: selectedPhaseId,
            groupId: selectedGroupId,
            round: round
        }));

        try {
            await apiPost("/api/matches", matchesData);
            onMatchesCreated(round);
            onClose();
        } catch (err) {
            console.error("Error bulk inserting matches:", err);
            setError("Failed to create matches. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const dialogTitle = "Crea Giornata (Bulk)";

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
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
                        <Button color="inherit" onClick={handleSave} disabled={isSubmitting || pairs.length === 0}>
                            SALVA
                        </Button>
                    </Toolbar>
                </AppBar>
            )}

            <DialogTitle sx={{ display: isMobile ? 'none' : 'block' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    {dialogTitle}
                    <IconButton onClick={onClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </Stack>
            </DialogTitle>

            <DialogContent dividers>
                <Stack spacing={3}>
                    {/* Round Header */}
                    <Paper variant="outlined" sx={{ p: 2, bgcolor: 'action.hover' }}>
                        <Stack direction={isMobile ? "column" : "row"} spacing={2} alignItems={isMobile ? "stretch" : "center"}>
                            <TextField
                                label="Giornata / Round"
                                value={round}
                                onChange={(e) => setRound(e.target.value)}
                                size="small"
                                fullWidth={isMobile}
                                sx={{ minWidth: 200 }}
                            />
                            <Typography variant="body2" color="text.secondary">
                                Seleziona due squadre per formare un accoppiamento.
                            </Typography>
                        </Stack>
                    </Paper>

                    {error && <Alert severity="error">{error}</Alert>}

                    {/* Builder Section */}
                    <Box>
                        <Typography variant="subtitle2" gutterBottom>
                            SQUADRE DISPONIBILI ({availableTeams.length})
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                            {availableTeams.length === 0 && pairs.length > 0 && (
                                <Typography variant="body2" color="success.main" sx={{ fontStyle: 'italic' }}>
                                    Tutte le squadre sono state accoppiate!
                                </Typography>
                            )}
                            {availableTeams.length === 0 && pairs.length === 0 && (
                                <Typography variant="body2" color="text.secondary">
                                    Nessuna squadra disponibile.
                                </Typography>
                            )}
                            {availableTeams.map(team => (
                                <Chip
                                    key={team.id}
                                    label={team.name}
                                    onClick={() => handleTeamClick(team)}
                                    color={selectedForPairing?.id === team.id ? "primary" : "default"}
                                    variant={selectedForPairing?.id === team.id ? "filled" : "outlined"}
                                    sx={{
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        '&:hover': { transform: 'scale(1.05)' }
                                    }}
                                />
                            ))}
                        </Box>
                    </Box>

                    <Divider />

                    {/* Pairs List */}
                    <Box>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                            <Typography variant="subtitle2">
                                GIORNATA IN PREPARAZIONE ({pairs.length} Partite)
                            </Typography>
                            <Button
                                startIcon={<RestartAltIcon />}
                                size="small"
                                onClick={resetBuilder}
                                disabled={pairs.length === 0 && !selectedForPairing}
                            >
                                Reset
                            </Button>
                        </Stack>

                        <Stack spacing={1}>
                            {pairs.length === 0 && (
                                <Paper variant="outlined" sx={{ p: 3, textAlign: 'center', borderStyle: 'dashed' }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Nessun accoppiamento creato. Clicca sulle squadre sopra per iniziare.
                                    </Typography>
                                </Paper>
                            )}
                            {pairs.map((pair, index) => (
                                <Paper
                                    key={index}
                                    variant="outlined"
                                    sx={{ p: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                                >
                                    <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1 }}>
                                        <Box sx={{ flex: 1, textAlign: 'right' }}>
                                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{pair.home.name}</Typography>
                                        </Box>
                                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold' }}>VS</Typography>
                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{pair.away.name}</Typography>
                                        </Box>
                                    </Stack>
                                    <IconButton size="small" color="error" onClick={() => removePair(index)}>
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </Paper>
                            ))}
                        </Stack>
                    </Box>
                </Stack>
            </DialogContent>

            {!isMobile && (
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={onClose} color="inherit">Annulla</Button>
                    <Button
                        variant="contained"
                        onClick={handleSave}
                        disabled={isSubmitting || pairs.length === 0}
                        startIcon={<AddIcon />}
                    >
                        {isSubmitting ? "Salvataggio..." : "Crea Partite"}
                    </Button>
                </DialogActions>
            )}
        </Dialog>
    );
}

MatchdayBuilder.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onMatchesCreated: PropTypes.func.isRequired,
    teams: PropTypes.array.isRequired,
    selectedEdition: PropTypes.object,
    selectedPhaseId: PropTypes.number,
    selectedGroupId: PropTypes.number,
    defaultRound: PropTypes.string
};

export default MatchdayBuilder;
