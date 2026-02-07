import CompetitionSelector from "./CompetitionSelector";
import { Grid, Stack, Typography } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import TeamsView from "./TeamsView";

function FootballArchiveView() {
  return (
    <Stack>
      <Stack direction="row">
        <CompetitionSelector></CompetitionSelector>
      </Stack>
      <Grid container spacing={2}>
        <Grid size={4}>
          <TeamsView></TeamsView>
        </Grid>
        <Grid size={8}>
          <Typography variant="h4">Matches</Typography>
          <List>
            <ListItem>Roma - Lazio 2 - 2</ListItem>
            <ListItem>Roma - Lazio 2 - 2</ListItem>
            <ListItem>Roma - Lazio 2 - 2</ListItem>
            <ListItem>Roma - Lazio 2 - 2</ListItem>
            <ListItem>Roma - Lazio 2 - 2</ListItem>
            <ListItem>Roma - Lazio 2 - 2</ListItem>
            <ListItem>Roma - Lazio 2 - 2</ListItem>
          </List>
        </Grid>
      </Grid>
    </Stack>
  );
}

export default FootballArchiveView;
