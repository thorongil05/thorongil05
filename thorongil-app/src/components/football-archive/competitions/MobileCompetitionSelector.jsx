import {
    Paper,
    Stack,
    Typography,
    IconButton,
    Button,
    Box,
    Dialog,
    DialogTitle,
    List,
    ListItemButton,
    ListItemText,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import PropTypes from "prop-types";
import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { UserRoles } from "../../../constants/roles";
import { useTranslation } from "react-i18next";

function MobileCompetitionSelector({
    competitions,
    selectedCompetition,
    onSelect,
    onAdd,
    onEdit,
}) {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [selectorOpen, setSelectorOpen] = useState(false);
    const canManage = user?.role === UserRoles.ADMIN || user?.role === UserRoles.EDITOR;

    const handleSelect = (comp) => {
        onSelect(comp);
        setSelectorOpen(false);
    };

    return (
        <Box sx={{ mb: 2 }}>
            <Paper
                variant="outlined"
                sx={{
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: "background.paper",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <Stack spacing={0.5} sx={{ minWidth: 0, flex: 1 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>
                        {t("football.competition", "Competition")}
                    </Typography>
                    <Typography variant="h6" noWrap sx={{ fontWeight: "bold" }}>
                        {selectedCompetition?.name || t("football.all_competitions", "All Competitions")}
                    </Typography>
                </Stack>

                <Stack direction="row" spacing={1}>
                    {canManage && selectedCompetition && (
                        <IconButton
                            size="small"
                            onClick={() => onEdit(selectedCompetition)}
                            color="primary"
                        >
                            <EditIcon fontSize="small" />
                        </IconButton>
                    )}
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={() => setSelectorOpen(true)}
                        startIcon={<SwapHorizIcon />}
                        sx={{ borderRadius: 20 }}
                    >
                        {t("common.switch", "Switch")}
                    </Button>
                </Stack>
            </Paper>

            <Dialog open={selectorOpen} onClose={() => setSelectorOpen(false)} fullWidth maxWidth="xs">
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {t("football.select_competition", "Select Competition")}
                    {canManage && (
                        <IconButton onClick={() => { setSelectorOpen(false); onAdd(); }} color="primary" size="small">
                            <AddIcon />
                        </IconButton>
                    )}
                </DialogTitle>
                <List sx={{ pt: 0 }}>
                    <ListItemButton
                        selected={selectedCompetition === null}
                        onClick={() => handleSelect(null)}
                    >
                        <ListItemText primary={t("football.all_competitions", "All Competitions")} />
                    </ListItemButton>
                    {competitions.map((comp) => (
                        <ListItemButton
                            key={comp.id}
                            selected={selectedCompetition?.id === comp.id}
                            onClick={() => handleSelect(comp)}
                        >
                            <ListItemText primary={comp.name} />
                        </ListItemButton>
                    ))}
                </List>
            </Dialog>
        </Box>
    );
}

MobileCompetitionSelector.propTypes = {
    competitions: PropTypes.array.isRequired,
    selectedCompetition: PropTypes.object,
    onSelect: PropTypes.func.isRequired,
    onAdd: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
};

export default MobileCompetitionSelector;
