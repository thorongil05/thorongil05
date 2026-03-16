import { Box, Typography, Stack, IconButton, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import PropTypes from "prop-types";

export function ScoreSelector({ label, value, onChange, disabled }) {
  return (
    <Box sx={{ textAlign: "center", mb: 2 }}>
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
        {label}
      </Typography>
      <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
        <IconButton
          size="large"
          onClick={() => onChange(Math.max(0, (value || 0) - 1))}
          disabled={disabled || (value || 0) <= 0}
          sx={{ border: "1px solid", borderColor: "divider" }}
        >
          <RemoveIcon />
        </IconButton>
        <TextField
          type="number"
          size="small"
          value={value ?? ""}
          onChange={(e) => {
            const val = e.target.value;
            onChange(val === "" ? 0 : parseInt(val));
          }}
          disabled={disabled}
          inputProps={{
            min: 0,
            style: { textAlign: 'center', fontWeight: 'bold', fontSize: '1.5rem' }
          }}
          sx={{ width: '80px' }}
        />
        <IconButton
          size="large"
          onClick={() => onChange(value === null ? 0 : value + 1)}
          disabled={disabled}
          sx={{ border: "1px solid", borderColor: "divider" }}
        >
          <AddIcon />
        </IconButton>
      </Stack>
    </Box>
  );
}

ScoreSelector.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};
