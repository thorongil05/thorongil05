import { Stack, List, ListItem } from "@mui/material";
import { useEffect, useState } from "react";

function CompetitionSelector() {
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
  useEffect(fetchCompetitions, []);
  return (
    <Stack direction={"column"}>
      {competitions.map((element) => (
        <List key={element.id}>
          <ListItem>{element.name}</ListItem>
        </List>
      ))}
    </Stack>
  );
}

export default CompetitionSelector;
