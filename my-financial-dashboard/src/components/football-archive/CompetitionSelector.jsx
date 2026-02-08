import { Stack, List, ListItem } from "@mui/material";
import { useEffect, useState } from "react";

function CompetitionSelector({ onCompetitionSelect, selectedCompetitionId }) {
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
