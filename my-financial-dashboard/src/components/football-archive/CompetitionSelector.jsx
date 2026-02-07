import { Stack, Card, CardHeader } from "@mui/material";
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
    <Stack direction={"row"}>
      {competitions.map((element) => (
        <Card key={element.id}>
          <CardHeader title={element.name}></CardHeader>
        </Card>
      ))}
    </Stack>
  );
}

export default CompetitionSelector;
