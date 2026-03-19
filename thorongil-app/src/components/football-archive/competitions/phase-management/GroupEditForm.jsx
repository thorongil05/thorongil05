import { Stack, TextField, Button, IconButton, Divider } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import PropTypes from "prop-types";
import TiebreakerEditor from "./TiebreakerEditor";

function NumField({ label, value, onChange }) {
  return (
    <TextField
      label={label}
      type="number"
      size="small"
      sx={{ width: 130 }}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

NumField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.number,
  onChange: PropTypes.func.isRequired,
};

function GroupEditForm({ group, onChange, onSave, onCancel }) {
  const handleMetaChange = (field, value) => {
    const parsed = value === "" ? undefined : parseInt(value);
    onChange({ ...group, metadata: { ...(group.metadata || {}), [field]: parsed } });
  };

  const handleTiebreakerChange = (criteria) => {
    onChange({ ...group, metadata: { ...(group.metadata || {}), tiebreakerCriteria: criteria } });
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
        <NumField label="Partecipanti" value={group.metadata?.participantsCount} onChange={(v) => handleMetaChange("participantsCount", v)} />
        <NumField label="Promozioni" value={group.metadata?.promotionsCount} onChange={(v) => handleMetaChange("promotionsCount", v)} />
        <NumField label="Retrocessioni" value={group.metadata?.relegationsCount} onChange={(v) => handleMetaChange("relegationsCount", v)} />
        <NumField label="Playoff" value={group.metadata?.playoffSpotsCount} onChange={(v) => handleMetaChange("playoffSpotsCount", v)} />
        <NumField label="Playout" value={group.metadata?.playoutSpotsCount} onChange={(v) => handleMetaChange("playoutSpotsCount", v)} />
      </Stack>
      <Divider sx={{ my: 0.5 }} />
      <TiebreakerEditor
        value={group.metadata?.tiebreakerCriteria ?? []}
        onChange={handleTiebreakerChange}
      />
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
