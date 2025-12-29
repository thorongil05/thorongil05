import PropTypes from "prop-types";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useState, useEffect } from "react";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TablePaginationActions from "@mui/material/TablePaginationActions";

function RealEstatesInfoTable({ realEstatesInfo }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [page, setPage] = useState(0);

  const ROWS_PER_PAGE = 10;
  let rows = realEstatesInfo;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowDown") {
        setSelectedIndex((prev) =>
          Math.min(prev + 1, realEstatesInfo.length - 1)
        );
      }

      if (e.key === "ArrowUp") {
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      }
    };

    globalThis.addEventListener("keydown", handleKeyDown);
    return () => globalThis.removeEventListener("keydown", handleKeyDown);
  }, [realEstatesInfo]);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell align="right">Address</TableCell>
            <TableCell align="right">City</TableCell>
            <TableCell align="right">Price</TableCell>
            <TableCell align="right">Area</TableCell>
            <TableCell align="right">€/m2</TableCell>
            <TableCell align="right">Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows
            .slice(page * ROWS_PER_PAGE, page * ROWS_PER_PAGE + ROWS_PER_PAGE)
            .map((row, index) => (
              <TableRow
                key={row.id}
                selected={index === selectedIndex}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.type}
                </TableCell>
                <TableCell align="right">{row.address}</TableCell>
                <TableCell align="right">{row.location}</TableCell>
                <TableCell align="right">{row.price}</TableCell>
                <TableCell align="right">{row.area}</TableCell>
                <TableCell align="right">
                  {(row.price / row.area).toFixed(2)}
                </TableCell>
                <TableCell align="right">
                  {new Date(row.date).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
        <TableFooter>
          <TablePagination
            rowsPerPageOptions={[ROWS_PER_PAGE]}
            colSpan={3}
            count={rows.length}
            rowsPerPage={ROWS_PER_PAGE}
            page={page}
            onPageChange={handleChangePage}
            ActionsComponent={TablePaginationActions}
          ></TablePagination>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}

RealEstatesInfoTable.propTypes = {
  realEstatesInfo: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      type: PropTypes.string.isRequired,
      address: PropTypes.string.isRequired,
      location: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      area: PropTypes.number.isRequired,
      date: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
    })
  ).isRequired,
};

export default RealEstatesInfoTable;
