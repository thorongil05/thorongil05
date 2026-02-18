import { Stack, Chip, Typography, IconButton, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AddCompetitionDialog from "./AddCompetitionDialog";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { UserRoles } from "../../constants/roles";
import { useTranslation } from "react-i18next";
import { apiGet } from "../../utils/api";

function CompetitionSelector({ onCompetitionSelect, selectedCompetitionId }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [competitions, setCompetitions] = useState([]);
  const [open, setOpen] = useState(false);

  const fetchCompetitions = () => {
    apiGet("/api/competitions")
      .then((data) => {
        setCompetitions(
          data.map((element) => ({
            id: element.id,
            name: element.name,
          }))
        );
      })
      .catch((error) => console.error("Error fetching competitions:", error));
  };

  const handleInsertCompleted = () => {
    setOpen(false);
    fetchCompetitions();
  };

  useEffect(fetchCompetitions, []);

  return (
    <Box sx={{ width: "100%", mb: 3 }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "text.secondary", textTransform: "uppercase", letterSpacing: 1 }}>
          {t("football.competitions", "Competitions")}
        </Typography>
        {user?.role === UserRoles.ADMIN && (
          <IconButton onClick={() => setOpen(true)} size="small" sx={{ p: 0.5 }}>
            <AddIcon fontSize="small" />
          </IconButton>
        )}
      </Stack>

      <AddCompetitionDialog
        open={open}
        onClose={() => setOpen(false)}
        onInsert={handleInsertCompleted}
      />

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 1,
          overflowX: "auto",
          pb: 1,
          "&::-webkit-scrollbar": {
            height: "4px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(0,0,0,0.1)",
            borderRadius: "4px",
          },
        }}
      >
        <Chip
          label={t("football.all_competitions", "All Competitions")}
          onClick={() => onCompetitionSelect?.(null)}
          color={selectedCompetitionId === null ? "primary" : "default"}
          variant={selectedCompetitionId === null ? "filled" : "outlined"}
          sx={{ fontWeight: selectedCompetitionId === null ? "bold" : "normal" }}
        />
        {competitions.map((comp) => (
          <Chip
            key={comp.id}
            label={comp.name}
            onClick={() => onCompetitionSelect?.(comp)}
            color={selectedCompetitionId === comp.id ? "primary" : "default"}
            variant={selectedCompetitionId === comp.id ? "filled" : "outlined"}
            sx={{ fontWeight: selectedCompetitionId === comp.id ? "bold" : "normal" }}
          />
        ))}
      </Box>
    </Box>
  );
}

export default CompetitionSelector;
