import { FormControl, InputLabel, Select, MenuItem, Box, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

function EditionSelector({ editions, selectedEditionId, onEditionSelect, loading }) {
    const { t } = useTranslation();

    if (loading) {
        return <Typography variant="body2">Caricamento stagioni...</Typography>;
    }

    if (!editions || editions.length === 0) {
        return (
            <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                Nessuna edizione trovata per questa competizione.
            </Typography>
        );
    }

    return (
        <Box sx={{ minWidth: 200 }}>
            <FormControl fullWidth size="small">
                <InputLabel id="edition-select-label">{t("football.edition", "Stagione / Edizione")}</InputLabel>
                <Select
                    labelId="edition-select-label"
                    id="edition-select"
                    value={selectedEditionId || ""}
                    label={t("football.edition", "Stagione / Edizione")}
                    onChange={(e) => {
                        const selected = editions.find(ed => ed.id === e.target.value);
                        onEditionSelect(selected);
                    }}
                >
                    {editions.map((edition) => (
                        <MenuItem key={edition.id} value={edition.id}>
                            {edition.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
}

EditionSelector.propTypes = {
    editions: PropTypes.array.isRequired,
    selectedEditionId: PropTypes.number,
    onEditionSelect: PropTypes.func.isRequired,
    loading: PropTypes.bool,
};

export default EditionSelector;
