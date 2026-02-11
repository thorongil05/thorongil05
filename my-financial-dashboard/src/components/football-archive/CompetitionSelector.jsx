import { Stack, List, ListItem, Typography, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AddCompetitionDialog from "./AddCompetitionDialog";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { UserRoles } from "../../constants/roles";

function CompetitionSelector({ onCompetitionSelect, selectedCompetitionId }) {
  const { user } = useAuth();
  const [competitions, setCompetitions] = useState([]);

  const fetchCompetitions = () => {
    const apiUrl = new URL(
      `${import.meta.env.VITE_SERVER_URL}/api/competitions`,
    );
    fetch(apiUrl)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setCompetitions(
          data.map((element) => {
            return {
              id: element.id,
              name: element.name,
            };
          }),
        );
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleInsertCompleted = () => {
    setOpen(false);
    fetchCompetitions();
  };

  useEffect(fetchCompetitions, []);
  return (
    <Stack direction={"column"}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
        <Typography variant="h6" sx={{ pl: 2 }}>Competitions</Typography>
        {user?.role === UserRoles.ADMIN && (
          <IconButton onClick={handleClickOpen} size="small">
            <AddIcon />
          </IconButton>
        )}
      </Stack>
      <AddCompetitionDialog
        open={open}
        onClose={handleClose}
        onInsert={handleInsertCompleted}
      />
      <ListItem
        onClick={() => onCompetitionSelect && onCompetitionSelect(null)}
        sx={{
          cursor: "pointer",
          backgroundColor:
            selectedCompetitionId === null
              ? "rgba(25, 118, 210, 0.08)"
              : "transparent",
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.04)",
          },
          marginBottom: "8px",
        }}
      >
        All Competitions
      </ListItem>
      {competitions.map((element) => (
        <List key={element.id}>
          <ListItem
            onClick={() => onCompetitionSelect && onCompetitionSelect(element)}
            sx={{
              cursor: "pointer",
              backgroundColor:
                selectedCompetitionId === element.id
                  ? "rgba(25, 118, 210, 0.08)"
                  : "transparent",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
            }}
          >
            {element.name}
          </ListItem>
        </List>
      ))}
    </Stack>
  );
}

export default CompetitionSelector;
