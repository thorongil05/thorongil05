import { useState, useEffect } from "react";
import { Stack, Typography, List, IconButton, ListItem } from "@mui/material";
import AddTeamDialog from "./AddTeamDialog";
import AddIcon from "@mui/icons-material/Add";

function TeamsView() {
  const [open, setOpen] = useState(false);
  const [teams, setTeams] = useState([]);

  const fetchTeams = () => {
    const apiUrl = new URL(`${import.meta.env.VITE_SERVER_URL}/api/teams`);
    fetch(apiUrl)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setTeams(
          data.map((element) => {
            return {
              id: element.id,
              name: element.name,
              city: element.city,
            };
          }),
        );
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleInsertCompleted = () => {
    setOpen(false);
    fetchTeams();
  };

  useEffect(fetchTeams, []);

  return (
    <Stack>
      <Stack direction="row">
        <Typography variant="h4">Teams</Typography>
        <IconButton onClick={handleClickOpen}>
          <AddIcon></AddIcon>
        </IconButton>
        <AddTeamDialog
          open={open}
          onClose={handleClose}
          onInsert={handleInsertCompleted}
        ></AddTeamDialog>
      </Stack>
      <List>
        {teams.map((element) => (
          <ListItem key={element.id}>
            {element.name} - {element.city}
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}

export default TeamsView;
