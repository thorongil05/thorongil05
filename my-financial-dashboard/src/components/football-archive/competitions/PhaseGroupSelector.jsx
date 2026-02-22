import { FormControl, InputLabel, Select, MenuItem, Stack, Typography, CircularProgress, Box } from "@mui/material";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { apiGet } from "../../../utils/api";


function PhaseGroupSelector({
    phases,
    selectedPhaseId,
    onPhaseSelect,
    selectedGroupId,
    onGroupSelect,
    loading
}) {
    const { t } = useTranslation();
    const [groups, setGroups] = useState([]);
    const [groupsLoading, setGroupsLoading] = useState(false);

    const selectedPhase = phases.find(p => p.id === selectedPhaseId);

    useEffect(() => {
        if (selectedPhaseId && selectedPhase?.type === 'GROUP') {
            setGroupsLoading(true);
            apiGet(`/api/competitions/phases/${selectedPhaseId}/groups`)
                .then(data => {
                    setGroups(data);
                    // Auto-select first group if none selected
                    if (data && data.length > 0 && !selectedGroupId) {
                        onGroupSelect(data[0].id);
                    } else if (!data || data.length === 0) {
                        onGroupSelect(null);
                    }
                })
                .catch(err => console.error("Error fetching groups:", err))
                .finally(() => setGroupsLoading(false));
        } else {
            setGroups([]);
            onGroupSelect(null);
        }
    }, [selectedPhaseId, selectedPhase?.type, onGroupSelect]);

    if (loading) {
        return <CircularProgress size={20} sx={{ ml: 2 }} />;
    }

    if (!phases || phases.length === 0) return null;

    return (
        <Stack direction="column" spacing={2} sx={{ width: "100%", alignItems: "center" }}>
            {phases.length === 1 ? (
                <Box sx={{ px: 1, textAlign: "center" }}>
                    <Typography variant="caption" color="text.secondary" display="block">
                        {t("football.phase", "Fase")}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                        {phases[0].name}
                    </Typography>
                </Box>
            ) : (
                <FormControl sx={{ minWidth: 200, width: '100%' }} size="small">
                    <InputLabel id="phase-select-label">{t("football.phase", "Fase")}</InputLabel>
                    <Select
                        labelId="phase-select-label"
                        value={selectedPhaseId || ""}
                        label={t("football.phase", "Fase")}
                        onChange={(e) => onPhaseSelect(e.target.value)}
                    >
                        {phases.map((phase) => (
                            <MenuItem key={phase.id} value={phase.id}>
                                {phase.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            )}

            {selectedPhase?.type === 'GROUP' && (
                groups.length === 1 && !groupsLoading ? (
                    <Box sx={{ px: 1, textAlign: "center" }}>
                        <Typography variant="caption" color="text.secondary" display="block">
                            {t("football.group", "Girone")}
                        </Typography>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                            {groups[0].name}
                        </Typography>
                    </Box>
                ) : (
                    <FormControl sx={{ minWidth: 200, width: '100%' }} size="small" disabled={groupsLoading}>
                        <InputLabel id="group-select-label">{t("football.group", "Girone")}</InputLabel>
                        <Select
                            labelId="group-select-label"
                            value={selectedGroupId || ""}
                            label={t("football.group", "Girone")}
                            onChange={(e) => onGroupSelect(e.target.value)}
                        >
                            {groups.length === 0 && !groupsLoading && (
                                <MenuItem value="" disabled>Nessun girone</MenuItem>
                            )}
                            {groups.map((group) => (
                                <MenuItem key={group.id} value={group.id}>
                                    {group.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )
            )}
        </Stack>
    );
}

PhaseGroupSelector.propTypes = {
    phases: PropTypes.array.isRequired,
    selectedPhaseId: PropTypes.number,
    onPhaseSelect: PropTypes.func.isRequired,
    selectedGroupId: PropTypes.number,
    onGroupSelect: PropTypes.func.isRequired,
    loading: PropTypes.bool
};

export default PhaseGroupSelector;
