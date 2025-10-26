import { LineChart } from "@mui/x-charts";
import { instruments } from "../data/model";
import { useState } from "react";
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

  const onInstrumentsSelected = (instruments) => {
    setSelectedInstruments(instruments);
  };

  return (
    <>
      <h1 className="text-xl font-medium">Bond Overview</h1>
      <div className="body">
        <div className="master-container">
          <SelectInstrument
            instruments={instruments}
            onInstrumentsSelected={onInstrumentsSelected}
          ></SelectInstrument>
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
