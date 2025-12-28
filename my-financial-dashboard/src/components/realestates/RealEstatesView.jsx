import { useState, useEffect } from "react";
import RealEstateInsertForm from "./RealEstateInsertForm";
import RealEstateHeader from "./RealEstateHeader";
import RealEstatesInfoTable from "./RealEstatesInfoTable";
import Collapse from "@mui/material/Collapse";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

function RealEstatesView() {
  const [realEstatesInfo, setRealEstatesInfo] = useState([]);
  const [isHeaderOpen, setIsHeaderOpen] = useState(false);

  const fetchRealEstatesInfo = () => {
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
              address: element.address,
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
  };

  useEffect(fetchRealEstatesInfo, []);
  return (
    <>
      <Card>
        <CardHeader
          title="Real Estates"
          action={
            <IconButton
              onClick={() => setIsHeaderOpen(!isHeaderOpen)}
              aria-label="expand"
              size="small"
            >
              {isHeaderOpen ? (
                <KeyboardArrowUpIcon />
              ) : (
                <KeyboardArrowDownIcon />
              )}
            </IconButton>
          }
        ></CardHeader>
      </Card>

      <Collapse in={isHeaderOpen} timeout={"auto"} unmountOnExit>
        <RealEstateHeader realEstatesInfo={realEstatesInfo}></RealEstateHeader>
      </Collapse>
      <RealEstateInsertForm
        onInsert={fetchRealEstatesInfo}
      ></RealEstateInsertForm>
      <RealEstatesInfoTable
        realEstatesInfo={realEstatesInfo}
      ></RealEstatesInfoTable>
    </>
  );
}

export default RealEstatesView;
