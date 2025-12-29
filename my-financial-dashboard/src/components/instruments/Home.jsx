import { mockInstruments } from "../../data/model";
import { useState, useEffect } from "react";
import SelectInstrument from "./SelectInstrument";
import InstrumentDetail from "./InstrumentDetail";
import "./Home.css";
import InstrumentsLineChart from "./Chart";

function Home() {
  const [selectedInstruments, setSelectedInstruments] = useState([]);
  const [instruments, setInstruments] = useState([]);

  useEffect(() => {
    const apiUrl = `${import.meta.env.VITE_SERVER_URL}/api/instruments`;
    console.log("Eseguito solo al caricamento della pagina (mount)");
    fetch(apiUrl)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setInstruments(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <>
      <h1 className="text-xl font-medium">Bond Overview</h1>
      <div className="body">
        <div className="master-container">
          <SelectInstrument
            instruments={mockInstruments}
            onInstrumentsSelected={setSelectedInstruments}
          ></SelectInstrument>
          {instruments.map((element) => {
            return <p key={element.key}>{element.name}</p>;
          })}
        </div>
        <div className="detail-container">
          <div>
            <InstrumentsLineChart
              instrumentsToDisplay={selectedInstruments}
            ></InstrumentsLineChart>
          </div>
          <div className="price-details-container">
            {selectedInstruments.map((instrument) => (
              <InstrumentDetail
                key={instrument.name}
                instrument={instrument}
              ></InstrumentDetail>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
