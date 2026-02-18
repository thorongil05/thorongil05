import {
    Table,
    TableBody,
    TableRow,
    TableCell,
    TableHead,
    IconButton,
    TableSortLabel,
    Tooltip,
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
        <Table size="small" aria-label="simple table">
            <TableHead>
                <TableRow>
                    <TableCell
                        sortDirection={sortBy === "round" ? sortOrder : false}
                        sx={{ width: "80px" }}
                    >
                        <TableSortLabel
                            active={sortBy === "round"}
                            direction={sortBy === "round" ? sortOrder : "asc"}
                            onClick={() => handleRequestSort("round")}
                        >
                            {t("football.round", "Round")}
                        </TableSortLabel>
                    </TableCell>
                    <TableCell>{t("football.home_team", "Home Team")}</TableCell>
                    <TableCell>{t("football.away_team", "Away Team")}</TableCell>
                    <TableCell colSpan={2} align="center">
                        {t("football.score", "Score")}
                    </TableCell>
                    {(user?.role === UserRoles.ADMIN || user?.role === UserRoles.EDITOR) && (
                        <TableCell align="right">{t("common.actions", "Actions")}</TableCell>
                    )}
                </TableRow>
            </TableHead>
            <TableBody>
                {loading && (
                    <TableRow>
                        <TableCell colSpan={user ? 6 : 5} align="center">
                            Loading matches...
                        </TableCell>
                    </TableRow>
                )}
                {error && !loading && (
                    <TableRow>
                        <TableCell
                            colSpan={user ? 6 : 5}
                            align="center"
                            style={{ color: "red" }}
                        >
                            Error: {error}
                        </TableCell>
                    </TableRow>
                )}
                {!loading && !error && matches.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={user ? 6 : 5} align="center">
                            No matches found
                        </TableCell>
                    </TableRow>
                )}
                {!loading &&
                    !error &&
                    matches.length > 0 &&
                    matches.map((match) => (
                        <TableRow key={match.id}>
                            <TableCell sx={{ width: "80px" }}>{match.round || "-"}</TableCell>
                            <TableCell
                                sx={{
                                    fontWeight:
                                        match.homeTeam?.id === Number(selectedTeamId)
                                            ? "bold"
                                            : "normal",
                                    color:
                                        match.homeTeam?.id === Number(selectedTeamId)
                                            ? "secondary.main"
                                            : "inherit",
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
                                            ? "secondary.main"
                                            : "inherit",
                                }}
                            >
                                {match.awayTeam?.name || "Unknown"}
                            </TableCell>
                            <TableCell colSpan={2} align="center">
                                {match.homeScore} - {match.awayScore}
                            </TableCell>
                            {(user?.role === UserRoles.ADMIN || user?.role === UserRoles.EDITOR) && (
                                <TableCell align="right">
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
                                </TableCell>
                            )}
                        </TableRow>
                    ))}
            </TableBody>
        </Table>
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
