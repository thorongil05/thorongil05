import {
    Stack,
    Typography,
    IconButton,
    Card,
    CardContent,
    Box,
    Divider,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { UserRoles } from "../../../constants/roles";
import { useAuth } from "../../../context/AuthContext";

function MobileMatchesView({
    matches,
    loading,
    error,
    handleEditMatch,
    handleDeleteMatch,
    selectedTeamId,
}) {
    const { t } = useTranslation();
    const { user } = useAuth();

    const isSelectedTeam = (teamId) => teamId === Number(selectedTeamId);

    return (
        <Stack spacing={2} sx={{ p: 1 }}>
            {loading && (
                <Typography align="center" variant="body2" sx={{ py: 2 }}>
                    Loading matches...
                </Typography>
            )}
            {error && !loading && (
                <Typography align="center" color="error" variant="body2" sx={{ py: 2 }}>
                    Error: {error}
                </Typography>
            )}
            {!loading && !error && matches.length === 0 && (
                <Typography align="center" variant="body2" sx={{ py: 2, color: "text.secondary" }}>
                    No matches found
                </Typography>
            )}
            {!loading &&
                !error &&
                matches.length > 0 &&
                matches.map((match) => (
                    <Card key={match.id} variant="outlined" sx={{ borderRadius: 2 }}>
                        <CardContent sx={{ p: '12px !important' }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                                    {t("football.round_short", "G.")} {match.round || "-"}
                                </Typography>
                                {(user?.role === UserRoles.ADMIN || user?.role === UserRoles.EDITOR) && (
                                    <Stack direction="row" spacing={1}>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleEditMatch(match)}
                                        >
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            color="error"
                                            onClick={() => handleDeleteMatch(match.id)}
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </Stack>
                                )}
                            </Stack>

                            <Stack spacing={1}>
                                {/* Home Team */}
                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            fontWeight: isSelectedTeam(match.homeTeam?.id) ? "bold" : "normal",
                                            color: isSelectedTeam(match.homeTeam?.id) ? "secondary.main" : "inherit",
                                        }}
                                    >
                                        {match.homeTeam?.name || "Unknown"}
                                    </Typography>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: 'bold',
                                            minWidth: '24px',
                                            textAlign: 'right'
                                        }}
                                    >
                                        {match.homeScore}
                                    </Typography>
                                </Stack>

                                <Divider sx={{ borderStyle: 'dashed', my: 0.5 }} />

                                {/* Away Team */}
                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            fontWeight: isSelectedTeam(match.awayTeam?.id) ? "bold" : "normal",
                                            color: isSelectedTeam(match.awayTeam?.id) ? "secondary.main" : "inherit",
                                        }}
                                    >
                                        {match.awayTeam?.name || "Unknown"}
                                    </Typography>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: 'bold',
                                            minWidth: '24px',
                                            textAlign: 'right'
                                        }}
                                    >
                                        {match.awayScore}
                                    </Typography>
                                </Stack>
                            </Stack>
                        </CardContent>
                    </Card>
                ))}
        </Stack>
    );
}

MobileMatchesView.propTypes = {
    matches: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
    error: PropTypes.string,
    handleEditMatch: PropTypes.func.isRequired,
    handleDeleteMatch: PropTypes.func.isRequired,
    selectedTeamId: PropTypes.string,
};

export default MobileMatchesView;
