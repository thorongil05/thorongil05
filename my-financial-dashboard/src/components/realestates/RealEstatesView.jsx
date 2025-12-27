import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

function createData(type, street, location, area, price, date) {
  return { type, street, location, area, price, date };
}

const rows = [
  createData(
    "Villa",
    "Via delle Eriche, 48",
    "Tirrenia, Pisa",
    90,
    289000,
    "27/12/2025"
  ),
  createData(
    "Appartamento",
    "Via Emilia",
    "Porta Fiorentina, Pisa",
    82,
    175000,
    "27/12/2025"
  ),
  createData(
    "Appartamento",
    "Via G. Notari, 34",
    "Santa Maria, Pisa",
    125,
    319000,
    "27/12/2025"
  ),
  createData(
    "Appartamento",
    "Via San Paolo",
    "Sant'Antonio, Pisa",
    50,
    156000,
    "27/12/2025"
  ),
  createData(
    "Appartamento",
    "Via Filippo Turati",
    "San Martino, Pisa",
    68,
    229000,
    "27/12/2025"
  ),
  createData(
    "Appartamento",
    "Via Antonio Ceci",
    "San Martino, Pisa",
    50,
    175000,
    "27/12/2025"
  ),
  createData(
    "Villa",
    "Via San Giusto",
    "San Giusto, Pisa",
    510,
    540000,
    "27/12/2025"
  ),
];

function RealEstatesView() {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell align="right">Street</TableCell>
            <TableCell align="right">City</TableCell>
            <TableCell align="right">Price</TableCell>
            <TableCell align="right">Area</TableCell>
            <TableCell align="right">€/m2</TableCell>
            <TableCell align="right">Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.name}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.type}
              </TableCell>
              <TableCell align="right">{row.street}</TableCell>
              <TableCell align="right">{row.location}</TableCell>
              <TableCell align="right">{row.price}</TableCell>
              <TableCell align="right">{row.area}</TableCell>
              <TableCell align="right">
                {(row.price / row.area).toFixed(2)}
              </TableCell>
              <TableCell align="right">{row.date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default RealEstatesView;
