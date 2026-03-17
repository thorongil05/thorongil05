import { Stack, TextField, Button, IconButton } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import PropTypes from "prop-types";

function GroupEditForm({ group, onChange, onSave, onCancel }) {
    const handleMetaChange = (field, value) => {
        const parsed = value === "" ? undefined : parseInt(value);
        onChange({ ...group, metadata: { ...(group.metadata || {}), [field]: parsed } });
    };

    return (
        <Stack spacing={1.5} sx={{ width: "100%" }}>
            <Stack direction="row" spacing={1}>
                <TextField
                    label="Nome Girone"
                    size="small"
                    autoFocus
                    fullWidth
                    value={group.name}
                    onChange={(e) => onChange({ ...group, name: e.target.value })}
                />
                <IconButton color="primary" onClick={onSave}><SaveIcon fontSize="small" /></IconButton>
                <IconButton onClick={onCancel}><CloseIcon fontSize="small" /></IconButton>
            </Stack>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <TextField
                    label="Partecipanti"
                    type="number"
                    size="small"
                    sx={{ width: 130 }}
                    value={group.metadata?.participantsCount ?? ""}
                    onChange={(e) => handleMetaChange("participantsCount", e.target.value)}
                />
                <TextField
                    label="Promozioni"
                    type="number"
                    size="small"
                    sx={{ width: 130 }}
                    value={group.metadata?.promotionsCount ?? ""}
                    onChange={(e) => handleMetaChange("promotionsCount", e.target.value)}
                />
                <TextField
                    label="Retrocessioni"
                    type="number"
                    size="small"
                    sx={{ width: 130 }}
                    value={group.metadata?.relegationsCount ?? ""}
                    onChange={(e) => handleMetaChange("relegationsCount", e.target.value)}
                />
                <TextField
                    label="Playoff"
                    type="number"
                    size="small"
                    sx={{ width: 130 }}
                    value={group.metadata?.playoffSpotsCount ?? ""}
                    onChange={(e) => handleMetaChange("playoffSpotsCount", e.target.value)}
                />
                <TextField
                    label="Playout"
                    type="number"
                    size="small"
                    sx={{ width: 130 }}
                    value={group.metadata?.playoutSpotsCount ?? ""}
                    onChange={(e) => handleMetaChange("playoutSpotsCount", e.target.value)}
                />
            </Stack>
            <Stack direction="row" spacing={1} justifyContent="flex-end">
                <Button size="small" onClick={onCancel}>Annulla</Button>
                <Button size="small" variant="contained" onClick={onSave}>Salva</Button>
            </Stack>
        </Stack>
    );
}

GroupEditForm.propTypes = {
    group: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
};

export default GroupEditForm;
