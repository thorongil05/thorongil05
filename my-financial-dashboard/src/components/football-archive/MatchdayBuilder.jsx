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
    Alert,
    Grid
} from "@mui/material";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import CloseIcon from "@mui/icons-material/Close";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import AddIcon from "@mui/icons-material/Add";
import { apiPost } from "../../utils/api";

// DND Kit Imports
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
    useDraggable,
    useDroppable,
} from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';

// --- Sub-components for DND ---

function DraggableTeam({ team, disabled }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: `team-${team.id}`,
        data: { team },
        disabled
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 999 : 1,
    } : undefined;

    return (
        <Chip
            ref={setNodeRef}
            label={team.name}
            {...listeners}
            {...attributes}
            style={style}
            color="primary"
            variant="outlined"
            sx={{
                cursor: 'grab',
                touchAction: 'none',
                '&:active': { cursor: 'grabbing' },
                m: 0.5
            }}
        />
    );
}

function DropZone({ id, team, label, onRemove }) {
    const { isOver, setNodeRef } = useDroppable({
        id: id,
    });

    const style = {
        backgroundColor: isOver ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
        border: '2px dashed',
        borderColor: isOver ? 'primary.main' : 'divider',
        borderRadius: '4px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s',
        flex: 1,
        minWidth: 0,
        position: 'relative',
        p: 0.5
    };

    return (
        <Box ref={setNodeRef} sx={style}>
            {team ? (
                <Chip
                    label={team.name}
                    size="small"
                    onDelete={onRemove}
                    color="primary"
                    sx={{
                        width: '100%',
                        '& .MuiChip-label': {
                            display: 'block',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            px: 1
                        }
                    }}
                />
            ) : (
                <Typography variant="caption" color="text.secondary" noWrap>{label}</Typography>
            )}
        </Box>
    );
}

function AvailableArea({ teams }) {
    const { setNodeRef, isOver } = useDroppable({ id: 'available-area' });

    return (
        <Paper
            ref={setNodeRef}
            variant="outlined"
            sx={{
                p: 2,
                minHeight: '80px',
                display: 'flex',
                flexWrap: 'wrap',
                gap: 0,
                bgcolor: isOver ? 'action.selected' : 'transparent',
                borderStyle: 'dashed'
            }}
        >
            {teams.length === 0 && (
                <Typography variant="body2" color="text.secondary" sx={{ width: '100%', textAlign: 'center' }}>
                    Tutte le squadre sono state assegnate.
                </Typography>
            )}
            {teams.map(team => (
                <DraggableTeam key={team.id} team={team} />
            ))}
        </Paper>
    );
}

function MatchSlot({ index, match, onRemove }) {
    return (
        <Paper variant="outlined" sx={{ p: 1, bgcolor: 'background.paper' }}>
            <Stack direction="row" spacing={1} alignItems="center">
                <DropZone
                    id={`match-${index}-home`}
                    team={match.homeTeam}
                    label="CASA"
                    onRemove={() => onRemove('home')}
                />
                <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>VS</Typography>
                <DropZone
                    id={`match-${index}-away`}
                    team={match.awayTeam}
                    label="TRASF."
                    onRemove={() => onRemove('away')}
                />
            </Stack>
        </Paper>
    );
}

// --- Main component ---

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
    const [matches, setMatches] = useState([]); // Array of { id, homeTeam, awayTeam }
    const [activeTeam, setActiveTeam] = useState(null); // For drag overlay
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(KeyboardSensor)
    );

    useEffect(() => {
        if (open) {
            setAvailableTeams([...teams]);
            // Initialize empty matches based on team count (e.g. 10 matches for 20 teams)
            const numMatches = Math.ceil(teams.length / 2);
            const initialMatches = Array.from({ length: numMatches }, (_, i) => ({
                id: `match-${i}`,
                homeTeam: null,
                awayTeam: null
            }));
            setMatches(initialMatches);
            setRound(defaultRound || "");
            setError(null);
        }
    }, [open, teams, defaultRound]);

    const handleDragStart = (event) => {
        const { active } = event;
        const teamIdStr = active.id.toString().replace('team-', '');
        const team = teams.find(t => t.id.toString() === teamIdStr);
        setActiveTeam(team);
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        setActiveTeam(null);

        if (!over) return;

        const teamIdStr = active.id.toString().replace('team-', '');
        const teamId = parseInt(teamIdStr);
        const team = teams.find(t => t.id === teamId);

        // Find where the team came from
        let sourceMatch = matches.find(m => m.homeTeam?.id === teamId || m.awayTeam?.id === teamId);

        // Target handling
        if (over.id.toString().startsWith('match-')) {
            const parts = over.id.toString().split('-');
            const matchIdx = parseInt(parts[1]);
            const slotType = parts[2]; // 'home' or 'away'

            setMatches(prev => {
                const newMatches = [...prev];
                const targetMatch = newMatches[matchIdx];
                const existingTeamInSlot = slotType === 'home' ? targetMatch.homeTeam : targetMatch.awayTeam;

                // 1. Clear the source if it was a match slot
                if (sourceMatch) {
                    const m = newMatches.find(match => match.id === sourceMatch.id);
                    if (m.homeTeam?.id === teamId) m.homeTeam = null;
                    else m.awayTeam = null;
                } else {
                    // Remove from available if it was there
                    setAvailableTeams(avail => avail.filter(t => t.id !== teamId));
                }

                // 2. If there was a team in the target slot, put it back
                if (existingTeamInSlot) {
                    if (sourceMatch) {
                        // Swap logic: put existing team into the source slot
                        const m = newMatches.find(match => match.id === sourceMatch.id);
                        if (sourceMatch.homeTeam?.id === teamId || (sourceMatch.homeTeam === null && sourceMatch.awayTeam?.id !== teamId)) {
                            m.homeTeam = existingTeamInSlot;
                        } else {
                            m.awayTeam = existingTeamInSlot;
                        }
                    } else {
                        // Put back to available
                        setAvailableTeams(avail => [...avail, existingTeamInSlot]);
                    }
                }

                // 3. Place the new team in the target slot
                if (slotType === 'home') targetMatch.homeTeam = team;
                else targetMatch.awayTeam = team;

                return newMatches;
            });
        } else if (over.id === 'available-area') {
            if (sourceMatch) {
                setMatches(prev => {
                    const newMatches = [...prev];
                    const m = newMatches.find(match => match.id === sourceMatch.id);
                    if (m.homeTeam?.id === teamId) m.homeTeam = null;
                    else m.awayTeam = null;
                    return newMatches;
                });
                setAvailableTeams(avail => [...avail, team]);
            }
        }
    };

    const removeFromSlot = (matchId, slotType) => {
        setMatches(prev => {
            const newMatches = [...prev];
            const m = newMatches.find(match => match.id === matchId);
            const team = slotType === 'home' ? m.homeTeam : m.awayTeam;
            if (team) {
                setAvailableTeams(avail => [...avail, team]);
                if (slotType === 'home') m.homeTeam = null;
                else m.awayTeam = null;
            }
            return newMatches;
        });
    };

    const handleSave = async () => {
        if (!round) {
            setError("Specifica il numero della giornata");
            return;
        }
        const finalPairs = matches.filter(m => m.homeTeam && m.awayTeam);
        if (finalPairs.length === 0) {
            setError("Crea almeno un accoppiamento (Casa vs Trasferta)");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        const matchesData = finalPairs.map(m => ({
            homeTeamId: m.homeTeam.id,
            awayTeamId: m.awayTeam.id,
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
            setError("Errore durante il salvataggio delle partite.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetBuilder = () => {
        setAvailableTeams([...teams]);
        const numMatches = Math.ceil(teams.length / 2);
        setMatches(Array.from({ length: numMatches }, (_, i) => ({
            id: `match-${i}`,
            homeTeam: null,
            awayTeam: null
        })));
        setError(null);
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" fullScreen={isMobile}>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                {isMobile && (
                    <AppBar sx={{ position: "relative" }}>
                        <Toolbar>
                            <IconButton edge="start" color="inherit" onClick={onClose}><CloseIcon /></IconButton>
                            <Typography sx={{ ml: 2, flex: 1 }} variant="h6">Matchday Builder</Typography>
                            <Button color="inherit" onClick={handleSave} disabled={isSubmitting}>SALVA</Button>
                        </Toolbar>
                    </AppBar>
                )}

                {!isMobile && (
                    <DialogTitle>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            Crea Giornata (Bulk)
                            <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>
                        </Stack>
                    </DialogTitle>
                )}

                <DialogContent dividers>
                    <Stack spacing={3}>
                        <Paper variant="outlined" sx={{ p: 2, bgcolor: 'action.hover' }}>
                            <Stack direction={isMobile ? "column" : "row"} spacing={2} alignItems="center">
                                <TextField
                                    label="Giornata / Round"
                                    value={round}
                                    onChange={(e) => setRound(e.target.value)}
                                    size="small"
                                    sx={{ minWidth: 150 }}
                                />
                                <Typography variant="body2" color="text.secondary">
                                    Trascina le squadre negli slot per formare le partite.
                                </Typography>
                                <Box sx={{ flex: 1 }} />
                                <Button startIcon={<RestartAltIcon />} size="small" onClick={resetBuilder}>Reset</Button>
                            </Stack>
                        </Paper>

                        {error && <Alert severity="error">{error}</Alert>}

                        <Box>
                            <Typography variant="subtitle2" gutterBottom>SQUADRE DISPONIBILI</Typography>
                            <AvailableArea teams={availableTeams} />
                        </Box>

                        <Divider />

                        <Box>
                            <Typography variant="subtitle2" gutterBottom>ACCOPPIAMENTI</Typography>
                            <Grid container spacing={1}>
                                {matches.map((match, index) => (
                                    <Grid item xs={12} sm={6} key={match.id}>
                                        <MatchSlot
                                            index={index}
                                            match={match}
                                            onRemove={(slot) => removeFromSlot(match.id, slot)}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    </Stack>
                </DialogContent>

                {!isMobile && (
                    <DialogActions sx={{ p: 2 }}>
                        <Button onClick={onClose}>Annulla</Button>
                        <Button variant="contained" onClick={handleSave} disabled={isSubmitting} startIcon={<AddIcon />}>
                            {isSubmitting ? "Salvataggio..." : "Crea Partite"}
                        </Button>
                    </DialogActions>
                )}

                <DragOverlay modifiers={[restrictToWindowEdges]}>
                    {activeTeam ? (
                        <Chip label={activeTeam.name} color="primary" variant="filled" sx={{ opacity: 0.8 }} />
                    ) : null}
                </DragOverlay>
            </DndContext>
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
