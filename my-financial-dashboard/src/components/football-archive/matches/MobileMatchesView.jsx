import {
    Stack,
    Typography,
    IconButton,
    Card,
    CardContent,
    Box,
    Divider,
} from "@mui/material";
import { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Menu, MenuItem, ListItemIcon, ListItemText } from "@mui/material";
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

    const [menuAnchor, setMenuAnchor] = useState(null);
    const [selectedMatch, setSelectedMatch] = useState(null);

    const handleContextMenu = (event, match) => {
        event.preventDefault();
        setSelectedMatch(match);
        setMenuAnchor({ mouseX: event.clientX - 2, mouseY: event.clientY - 4 });
    };

    const handleCloseMenu = () => {
        setMenuAnchor(null);
    };

    const handleEdit = () => {
        if (selectedMatch) handleEditMatch(selectedMatch);
        handleCloseMenu();
    };

    const handleDelete = () => {
        if (selectedMatch) handleDeleteMatch(selectedMatch.id);
        handleCloseMenu();
    };

    const isSelectedTeam = (teamId) => teamId === Number(selectedTeamId);

    return (
        <Stack spacing={1} sx={{ p: 1 }}>
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
                    <Card
                        key={match.id}
                        variant="outlined"
                        sx={{
                            borderRadius: 2,
                            overflow: 'hidden',
                            position: 'relative',
                            transition: 'background-color 0.2s',
                            '&:active': { bgcolor: 'action.hover' },
                            userSelect: 'none',
                            WebkitTouchCallout: 'none'
                        }}
                        onContextMenu={(e) => handleContextMenu(e, match)}
                    >
                        <Stack direction="row" sx={{ height: '70px' }}>
                            {/* Vertical Round Indicator */}
                            <Box
                                sx={{
                                    width: 32,
                                    bgcolor: 'action.selected',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRight: '1px solid',
                                    borderColor: 'divider',
                                    flexShrink: 0
                                }}
                            >
                                <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'text.secondary', writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
                                    {t("football.round_short", "G.")} {match.round || "-"}
                                </Typography>
                            </Box>

                            <CardContent sx={{ p: '8px !important', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                <Stack spacing={0.5}>
                                    {/* Home Team */}
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Typography
                                            variant="body2"
                                            noWrap
                                            sx={{
                                                fontWeight: isSelectedTeam(match.homeTeam?.id) ? "bold" : "500",
                                                color: isSelectedTeam(match.homeTeam?.id) ? "secondary.main" : "text.primary",
                                                flex: 1
                                            }}
                                        >
                                            {match.homeTeam?.name || "Unknown"}
                                        </Typography>
                                        <Typography
                                            variant="body1"
                                            sx={{
                                                fontWeight: 'bold',
                                                minWidth: '24px',
                                                textAlign: 'right',
                                                fontFamily: 'monospace'
                                            }}
                                        >
                                            {match.homeScore}
                                        </Typography>
                                    </Stack>

                                    {/* Away Team */}
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Typography
                                            variant="body2"
                                            noWrap
                                            sx={{
                                                fontWeight: isSelectedTeam(match.awayTeam?.id) ? "bold" : "500",
                                                color: isSelectedTeam(match.awayTeam?.id) ? "secondary.main" : "text.primary",
                                                flex: 1
                                            }}
                                        >
                                            {match.awayTeam?.name || "Unknown"}
                                        </Typography>
                                        <Typography
                                            variant="body1"
                                            sx={{
                                                fontWeight: 'bold',
                                                minWidth: '24px',
                                                textAlign: 'right',
                                                fontFamily: 'monospace'
                                            }}
                                        >
                                            {match.awayScore}
                                        </Typography>
                                    </Stack>
                                </Stack>
                            </CardContent>
                        </Stack>
                    </Card>
                ))}

            <Menu
                open={menuAnchor !== null}
                onClose={handleCloseMenu}
                anchorReference="anchorPosition"
                anchorPosition={
                    menuAnchor !== null
                        ? { top: menuAnchor.mouseY, left: menuAnchor.mouseX }
                        : undefined
                }
            >
                <MenuItem onClick={handleEdit}>
                    <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
                    <ListItemText>{t("common.edit", "Edit")}</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
                    <ListItemIcon><DeleteIcon fontSize="small" color="error" /></ListItemIcon>
                    <ListItemText>{t("common.delete", "Delete")}</ListItemText>
                </MenuItem>
            </Menu>
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
