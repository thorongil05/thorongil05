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
  Drawer,
  Button,
} from "@mui/material";
import TeamsView from "./TeamsView";
import AddMatchForm from "./AddMatchForm";
import { useState } from "react";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

function FootballArchiveView() {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };
  return (
    <>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        <CompetitionSelector></CompetitionSelector>
      </Drawer>
      <Stack direction="row">
        <Button onClick={toggleDrawer(true)}>
          <KeyboardArrowRightIcon></KeyboardArrowRightIcon>
        </Button>
      </Stack>
      <Stack>
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
        <AddMatchForm></AddMatchForm>
      </Stack>
    </>
  );
}

export default FootballArchiveView;
