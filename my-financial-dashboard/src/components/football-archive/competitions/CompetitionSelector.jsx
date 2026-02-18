import { Box, useTheme, useMediaQuery } from "@mui/material";
import CompetitionDialog from "./CompetitionDialog";
import DesktopCompetitionSelector from "./DesktopCompetitionSelector";
import MobileCompetitionSelector from "./MobileCompetitionSelector";
import { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { apiGet } from "../../../utils/api";

function CompetitionSelector({ onCompetitionSelect, selectedCompetitionId }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [competitions, setCompetitions] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [competitionToEdit, setCompetitionToEdit] = useState(null);

  const fetchCompetitions = useCallback(() => {
    apiGet("/api/competitions")
      .then((data) => {
        setCompetitions(data);
      })
      .catch((error) => console.error("Error fetching competitions:", error));
  }, []);

  useEffect(() => {
    fetchCompetitions();
  }, [fetchCompetitions]);

  const handleOpenAdd = () => {
    setCompetitionToEdit(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (comp) => {
    setCompetitionToEdit(comp);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setCompetitionToEdit(null);
  };

  const handleDialogSubmit = () => {
    handleDialogClose();
    fetchCompetitions();
  };

  const selectedCompetition = competitions.find(c => c.id === selectedCompetitionId) || null;

  return (
    <Box sx={{
      width: isMobile ? "100%" : "280px",
      flexShrink: 0,
      mb: isMobile ? 2 : 0
    }}>
      {isMobile ? (
        <MobileCompetitionSelector
          competitions={competitions}
          selectedCompetition={selectedCompetition}
          onSelect={onCompetitionSelect}
          onAdd={handleOpenAdd}
          onEdit={handleOpenEdit}
        />
      ) : (
        <DesktopCompetitionSelector
          competitions={competitions}
          selectedId={selectedCompetitionId}
          onSelect={onCompetitionSelect}
          onAdd={handleOpenAdd}
          onEdit={handleOpenEdit}
        />
      )}

      <CompetitionDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        onInsert={handleDialogSubmit}
        competitionToEdit={competitionToEdit}
      />
    </Box>
  );
}

export default CompetitionSelector;
