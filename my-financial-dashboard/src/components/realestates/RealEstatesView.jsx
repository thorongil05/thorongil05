import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useState, useEffect } from "react";
import RealEstateInsertForm from "./RealEstateInsertForm";

function RealEstatesView() {
  const [realEstatesInfo, setRealEstatesInfo] = useState([]);
  useEffect(() => {
    const apiUrl = `${import.meta.env.VITE_SERVER_URL}/api/real-estates`;
    console.log("Eseguito solo al caricamento della pagina (mount)");
    fetch(apiUrl)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setRealEstatesInfo(
          data.map((element) => {
            return {
              id: element.id,
              type: element.type,
              street: element.address,
              location: `${element.location} - ${element.city}`,
              price: element.price,
              area: element.area,
              date: element.referenceDate,
            };
          })
        );
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  return (
    <>
      <RealEstateInsertForm></RealEstateInsertForm>
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
            {realEstatesInfo.map((row) => (
              <TableRow
                key={row.id}
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
    </>
  );
}

export default RealEstatesView;
