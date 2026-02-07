import CompetitionSelector from "./CompetitionSelector";
import { IconButton, Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import AddTeamDialog from "./AddTeamDialog";

function FootballArchiveView() {
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

  useEffect(fetchTeams, []);

  return (
    <Stack>
      <Stack direction="row">
        <CompetitionSelector></CompetitionSelector>
        <IconButton onClick={handleClickOpen}>
          <AddIcon></AddIcon>
        </IconButton>
        <AddTeamDialog open={open} onClose={handleClose}></AddTeamDialog>
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

export default FootballArchiveView;
