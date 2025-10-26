import { LineChart } from "@mui/x-charts";
import { mockInstruments } from "../data/model";
import { useState, useEffect } from "react";
import { axisClasses } from "@mui/x-charts/ChartsAxis";
import SelectInstrument from "./SelectInstrument";
import InstrumentDetail from "./InstrumentDetail";
import "./Home.css";

function formatDate(value) {
  if (typeof value == "number") {
    value = new Date(value);
  }
  return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(
    2,
    "0"
  )}`;
}

function Home() {
  const [selectedInstruments, setSelectedInstruments] = useState([]);
  const [instruments, setInstruments] = useState([]);

  useEffect(() => {
    console.log("Eseguito solo al caricamento della pagina (mount)");
    fetch("http://localhost:3000/instruments")
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

  let x = selectedInstruments
    .map((instrument) => ({
      name: instrument.name,
      prices: instrument.prices,
    }))
    .map((entry) => {
      return {
        id: entry.name,
        data: entry.prices.map((t) => t.date),
        valueFormatter: (value) => formatDate(value),
      };
    });

  let y = selectedInstruments
    .map((instrument) => instrument.prices)
    .map((value) => ({
      data: value.map((t) => t.price),
    }));

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
            return <p>{element.name}</p>;
          })}
        </div>
        <div className="detail-container">
          <div>
            <LineChart
              // sx is used to overwrite classes of the line chart component
              sx={() => ({
                [`.${axisClasses.root}`]: {
                  [`.${axisClasses.tick}, .${axisClasses.line}`]: {
                    stroke: "#FFFFFF",
                  },
                  [`.${axisClasses.tickLabel}`]: {
                    fill: "#FFFFFF",
                  },
                },
              })}
              xAxis={x}
              series={y}
              height={300}
            />
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
