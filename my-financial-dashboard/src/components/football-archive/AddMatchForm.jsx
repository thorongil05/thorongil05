import { Autocomplete, Grid, TextField } from "@mui/material";
import { useEffect, useState } from "react";

function AddMatchForm() {
  let [availableTeams, setAvailableTeams] = useState([]);
  let [homeTeamOptions, setHomeTeamOptions] = useState([]);
  let [awayTeamOptions, setAwayTeamOptions] = useState([]);
  let [match, setMatch] = useState({
    homeTeam: null,
    awayTeam: null,
    homeTeamScore: null,
    awayTeamScore: null,
  });

  // TODO: receive the teams as input?
  const fetchTeams = () => {
    const apiUrl = new URL(`${import.meta.env.VITE_SERVER_URL}/api/teams`);
    fetch(apiUrl)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        let retrievedTeams = data.map((element) => {
          return {
            id: element.id,
            name: element.name,
            city: element.city,
          };
        });
        setAvailableTeams(retrievedTeams);
        // Options will be initialized automatically by useEffect when availableTeams changes
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  // Update options when team selections change
  useEffect(() => {
    // Filter out the selected away team from home options
    setHomeTeamOptions(
      availableTeams.filter(
        (team) => !match.awayTeam || team.id !== match.awayTeam.id,
      ),
    );
  }, [match.awayTeam, availableTeams]);

  useEffect(() => {
    // Filter out the selected home team from away options
    setAwayTeamOptions(
      availableTeams.filter(
        (team) => !match.homeTeam || team.id !== match.homeTeam.id,
      ),
    );
  }, [match.homeTeam, availableTeams]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!match.homeTeam || !match.awayTeam) {
      alert("Please select both home and away teams");
      return;
    }

    // Now we can access the full team objects with id, name, city
    console.log("Selected home team:", match.homeTeam); // {id: 1, name: "Milan", city: "Milano"}
    console.log("Selected away team:", match.awayTeam); // {id: 2, name: "Juventus", city: "Torino"}

    // For API submission, extract the IDs
    const matchData = {
      homeTeamId: match.homeTeam.id,
      awayTeamId: match.awayTeam.id,
      homeGoals: match.homeTeamScore,
      awayGoals: match.awayTeamScore,
    };

    console.log("Submitting match data:", matchData);
    // TODO: Add API call here
    alert("Match data prepared for submission!");
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={1}>
        <Grid size={4}>
          <Autocomplete
            size="small"
            disablePortal
            options={homeTeamOptions}
            getOptionLabel={(option) => option?.name || ""}
            isOptionEqualToValue={(option, value) => option?.id === value?.id}
            sx={{ width: 300 }}
            name="homeTeam"
            value={match.homeTeam}
            onChange={(_event, newValue) => {
              setMatch((prev) => ({ ...prev, homeTeam: newValue }));
            }}
            renderInput={(params) => (
              <TextField {...params} label="Home Team" />
            )}
          ></Autocomplete>
        </Grid>
        <Grid size={4}>
          <Autocomplete
            size="small"
            disablePortal
            options={awayTeamOptions}
            getOptionLabel={(option) => option?.name || ""}
            isOptionEqualToValue={(option, value) => option?.id === value?.id}
            sx={{ width: 300 }}
            name="awayTeam"
            value={match.awayTeam}
            onChange={(_event, newValue) => {
              setMatch((prev) => ({ ...prev, awayTeam: newValue }));
            }}
            renderInput={(params) => (
              <TextField {...params} label="Away Team" />
            )}
          ></Autocomplete>
        </Grid>
        <Grid size={2}>
          <TextField
            size="small"
            label="Home Score"
            type="number"
            name="homeTeamScore"
            value={match.homeTeamScore ?? ""}
            onChange={(event) => {
              const value = event.target.value;
              setMatch((prev) => ({
                ...prev,
                homeTeamScore: value === "" ? null : parseInt(value),
              }));
            }}
          ></TextField>
        </Grid>
        <Grid size={2}>
          <TextField
            size="small"
            label="Away Score"
            type="number"
            name="awayTeamScore"
            value={match.awayTeamScore ?? ""}
            onChange={(event) => {
              const value = event.target.value;
              setMatch((prev) => ({
                ...prev,
                awayTeamScore: value === "" ? null : parseInt(value),
              }));
            }}
          ></TextField>
        </Grid>
        <Grid size={12}>
          <button
            type="submit"
            style={{ padding: "8px 16px", marginTop: "16px" }}
          >
            Add Match
          </button>
        </Grid>
      </Grid>
    </form>
  );
}

export default AddMatchForm;
