import {
    List,
    ListItemButton,
    ListItemText,
    ListItemIcon,
    Typography,
    Paper,
    Stack,
    IconButton,
    Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import PropTypes from "prop-types";
import { useAuth } from "../../../context/AuthContext";
import { UserRoles } from "../../../constants/roles";
import { useTranslation } from "react-i18next";

function DesktopCompetitionSelector({
    competitions,
    selectedId,
    onSelect,
    onAdd,
    onEdit,
}) {
    const { t } = useTranslation();
    const { user } = useAuth();
    const canManage = user?.role === UserRoles.ADMIN || user?.role === UserRoles.EDITOR;

    return (
        <Paper variant="outlined" sx={{ width: "100%", height: "fit-content", borderRadius: 2, overflow: "hidden" }}>
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ p: 2, borderBottom: "1px solid", borderColor: "divider" }}
            >
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    {t("football.competitions", "Competitions")}
                </Typography>
                {canManage && (
                    <Tooltip title={t("football.add_competition", "Add Competition")}>
                        <IconButton onClick={onAdd} size="small" color="primary">
                            <AddIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                )}
            </Stack>
            <List sx={{ p: 0 }}>
                <ListItemButton
                    selected={selectedId === null}
                    onClick={() => onSelect(null)}
                    sx={{ borderLeft: "4px solid", borderLeftColor: selectedId === null ? "primary.main" : "transparent" }}
                >
                    <ListItemText
                        primary={t("football.all_competitions", "All Competitions")}
                        primaryTypographyProps={{ fontWeight: selectedId === null ? "bold" : "normal" }}
                    />
                </ListItemButton>
                {competitions.map((comp) => (
                    <ListItemButton
                        key={comp.id}
                        selected={selectedId === comp.id}
                        onClick={() => onSelect(comp)}
                        sx={{ borderLeft: "4px solid", borderLeftColor: selectedId === comp.id ? "primary.main" : "transparent" }}
                    >
                        <ListItemIcon sx={{ minWidth: 36 }}>
                            <EmojiEventsIcon fontSize="small" color={selectedId === comp.id ? "primary" : "action"} />
                        </ListItemIcon>
                        <ListItemText
                            primary={comp.name}
                            primaryTypographyProps={{
                                fontWeight: selectedId === comp.id ? "bold" : "normal",
                                noWrap: true
                            }}
                        />
                        {canManage && selectedId === comp.id && (
                            <Tooltip title={t("common.edit", "Edit")}>
                                <IconButton
                                    size="small"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onEdit(comp);
                                    }}
                                    sx={{ ml: 1 }}
                                >
                                    <EditIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        )}
                    </ListItemButton>
                ))}
            </List>
        </Paper>
    );
}

DesktopCompetitionSelector.propTypes = {
    competitions: PropTypes.array.isRequired,
    selectedId: PropTypes.number,
    onSelect: PropTypes.func.isRequired,
    onAdd: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
};

export default DesktopCompetitionSelector;
