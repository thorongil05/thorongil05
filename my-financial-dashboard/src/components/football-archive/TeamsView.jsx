import { useState } from "react";
import { Stack, Typography, List, IconButton, ListItem } from "@mui/material";
import AddTeamDialog from "./AddTeamDialog";
import AddIcon from "@mui/icons-material/Add";

function TeamsView({ teams, loading, onTeamAdded }) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleInsertCompleted = () => {
    setOpen(false);
    if (onTeamAdded) {
      onTeamAdded();
    }
  };

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
        {loading ? (
          <ListItem>Loading teams...</ListItem>
        ) : (
          teams.map((element) => (
            <ListItem key={element.id}>
              {element.name} - {element.city}
            </ListItem>
          ))
        )}
      </List>
    </Stack>
  );
}

export default TeamsView;
