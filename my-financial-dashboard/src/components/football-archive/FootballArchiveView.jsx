import CompetitionSelector from "./CompetitionSelector";
import {
  Grid,
  Paper,
  Stack,
  TableContainer,
  Table,
  Typography,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
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
          <TableContainer component={Paper}>
            <Table
              sx={{ minWidth: 650 }}
              size="small"
              aria-label="simple table"
            >
              <TableBody>
                <TableRow>
                  <TableCell>Roma</TableCell>
                  <TableCell>Lazio</TableCell>
                  <TableCell>2</TableCell>
                  <TableCell>2</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Stack>
  );
}

export default FootballArchiveView;
