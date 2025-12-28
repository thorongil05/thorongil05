import { useState, useEffect } from "react";
import RealEstateInsertForm from "./RealEstateInsertForm";
import RealEstateHeader from "./RealEstateHeader";
import RealEstatesInfoTable from "./RealEstatesInfoTable";

function RealEstatesView() {
  const [realEstatesInfo, setRealEstatesInfo] = useState([]);

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
      <RealEstateHeader></RealEstateHeader>
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
