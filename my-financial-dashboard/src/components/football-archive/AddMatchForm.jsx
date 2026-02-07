import { Autocomplete, Grid, TextField } from "@mui/material";
import { useState } from "react";

function AddMatchForm() {
  let [match, _setMatch] = useState({
    homeTeam: undefined,
    awayTeam: undefined,
    homeTeamScore: undefined,
    awayTeamScore: undefined,
  });

  return (
    <form>
      <Grid container spacing={1}>
        <Grid size={4}>
          <Autocomplete
            size="small"
            disablePortal
            options={[]}
            sx={{ width: 300 }}
            name="homeTeam"
            value={match.homeTeam}
            renderInput={(params) => (
              <TextField {...params} label="Home Team" />
            )}
          ></Autocomplete>
        </Grid>
        <Grid size={4}>
          <Autocomplete
            size="small"
            disablePortal
            options={[]}
            sx={{ width: 300 }}
            name="awayTeam"
            value={match.homeTeam}
            renderInput={(params) => (
              <TextField {...params} label="Away Team" />
            )}
          ></Autocomplete>
        </Grid>
        <Grid size={2}>
          <TextField
            size="small"
            label="Price"
            type="number"
            name="price"
            value={match.awayTeamScore}
            onChange={() => {}}
          ></TextField>
        </Grid>
        <Grid size={2}>
          <TextField
            size="small"
            label="Price"
            type="number"
            name="price"
            value={match.awayTeamScore}
            onChange={() => {}}
          ></TextField>
        </Grid>
      </Grid>
    </form>
  );
}

export default AddMatchForm;
