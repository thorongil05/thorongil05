import {
    Table,
    TableBody,
    TableRow,
    TableCell,
    TableHead,
    IconButton,
    TableSortLabel,
    Tooltip,
    Box,
    Typography,
    TableContainer,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { UserRoles } from "../../../constants/roles";
import { useAuth } from "../../../context/AuthContext";

function DesktopMatchesView({
    matches,
    loading,
    error,
    sortBy,
    sortOrder,
    handleRequestSort,
    handleEditMatch,
    handleDeleteMatch,
    selectedTeamId,
}) {
    const { t } = useTranslation();
    const { user } = useAuth();

    return (
        <TableContainer sx={{
            maxHeight: 600,
            overflow: "auto",
            "&::-webkit-scrollbar": {
                width: "6px",
                height: "6px",
            },
            "&::-webkit-scrollbar-track": {
                background: "transparent",
            },
            "&::-webkit-scrollbar-thumb": {
                background: "rgba(0,0,0,0.1)",
                borderRadius: "10px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
                background: "rgba(0,0,0,0.2)",
            },
        }}>
            <Table stickyHeader size="small" aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell
                            sortDirection={sortBy === "round" ? sortOrder : false}
                            sx={{ width: "100px", fontWeight: "bold", bgcolor: "background.paper" }}
                        >
                            <TableSortLabel
                                active={sortBy === "round"}
                                direction={sortBy === "round" ? sortOrder : "asc"}
                                onClick={() => handleRequestSort("round")}
                            >
                                {t("football.round", "Round")}
                            </TableSortLabel>
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold", bgcolor: "background.paper" }}>{t("football.home_team", "Home Team")}</TableCell>
                        <TableCell sx={{ fontWeight: "bold", bgcolor: "background.paper" }}>{t("football.away_team", "Away Team")}</TableCell>
                        <TableCell align="center" sx={{ fontWeight: "bold", bgcolor: "background.paper", width: "120px" }}>
                            {t("football.score", "Score")}
                        </TableCell>
                        {(user?.role === UserRoles.ADMIN || user?.role === UserRoles.EDITOR) && (
                            <TableCell align="right" sx={{ fontWeight: "bold", bgcolor: "background.paper" }}>{t("common.actions", "Actions")}</TableCell>
                        )}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {loading && (
                        <TableRow>
                            <TableCell colSpan={user ? 6 : 5} align="center" sx={{ py: 4 }}>
                                <Typography variant="body2" color="text.secondary">Loading matches...</Typography>
                            </TableCell>
                        </TableRow>
                    )}
                    {error && !loading && (
                        <TableRow>
                            <TableCell
                                colSpan={user ? 6 : 5}
                                align="center"
                                sx={{ py: 4 }}
                            >
                                <Typography variant="body2" color="error">Error: {error}</Typography>
                            </TableCell>
                        </TableRow>
                    )}
                    {!loading && !error && matches.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={user ? 6 : 5} align="center" sx={{ py: 4 }}>
                                <Typography variant="body2" color="text.secondary">No matches found</Typography>
                            </TableCell>
                        </TableRow>
                    )}
                    {!loading &&
                        !error &&
                        matches.length > 0 &&
                        matches.map((match) => (
                            <TableRow
                                key={match.id}
                                hover
                                sx={{
                                    "&:last-child td, &:last-child th": { border: 0 },
                                    transition: "background-color 0.2s"
                                }}
                            >
                                <TableCell sx={{ color: "text.secondary" }}>{match.round || "-"}</TableCell>
                                <TableCell
                                    sx={{
                                        fontWeight:
                                            match.homeTeam?.id === Number(selectedTeamId)
                                                ? "bold"
                                                : "normal",
                                        color:
                                            match.homeTeam?.id === Number(selectedTeamId)
                                                ? "primary.main"
                                                : "text.primary",
                                    }}
                                >
                                    {match.homeTeam?.name || "Unknown"}
                                </TableCell>
                                <TableCell
                                    sx={{
                                        fontWeight:
                                            match.awayTeam?.id === Number(selectedTeamId)
                                                ? "bold"
                                                : "normal",
                                        color:
                                            match.awayTeam?.id === Number(selectedTeamId)
                                                ? "primary.main"
                                                : "text.primary",
                                    }}
                                >
                                    {match.awayTeam?.name || "Unknown"}
                                </TableCell>
                                <TableCell align="center">
                                    <Box sx={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        bgcolor: "action.selected",
                                        px: 2,
                                        py: 0.5,
                                        borderRadius: 5,
                                        minWidth: "60px",
                                        fontWeight: "bold",
                                        border: "1px solid",
                                        borderColor: "divider"
                                    }}>
                                        {match.homeScore} - {match.awayScore}
                                    </Box>
                                </TableCell>
                                {(user?.role === UserRoles.ADMIN || user?.role === UserRoles.EDITOR) && (
                                    <TableCell align="right">
                                        <Tooltip title={t("common.edit")}>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleEditMatch(match)}
                                                sx={{ mr: 0.5 }}
                                            >
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title={t("common.delete")}>
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => handleDeleteMatch(match.id)}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

DesktopMatchesView.propTypes = {
    matches: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
    error: PropTypes.string,
    sortBy: PropTypes.string.isRequired,
    sortOrder: PropTypes.string.isRequired,
    handleRequestSort: PropTypes.func.isRequired,
    handleEditMatch: PropTypes.func.isRequired,
    handleDeleteMatch: PropTypes.func.isRequired,
    selectedTeamId: PropTypes.string,
};

export default DesktopMatchesView;
