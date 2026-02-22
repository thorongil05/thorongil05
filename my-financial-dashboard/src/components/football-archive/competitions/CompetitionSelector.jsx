import { Box, useTheme, useMediaQuery } from "@mui/material";
import DesktopCompetitionSelector from "./DesktopCompetitionSelector";
import MobileCompetitionSelector from "./MobileCompetitionSelector";
import { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { apiGet } from "../../../utils/api";

function CompetitionSelector({ onCompetitionSelect, selectedCompetitionId }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const [competitions, setCompetitions] = useState([]);

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
    navigate("/football-archive/competition/add");
  };

  const handleOpenEdit = (comp) => {
    navigate(`/football-archive/competition/edit/${comp.id}`);
  };

  const selectedCompetition = competitions.find(c => c.id === selectedCompetitionId) || null;

  return (
    <Box sx={{
      width: "100%",
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
    </Box>
  );
}

export default CompetitionSelector;
