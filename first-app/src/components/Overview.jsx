import { LineChart } from "@mui/x-charts";
import { instruments } from "../data/model";
import { useState } from "react";
import { axisClasses } from "@mui/x-charts/ChartsAxis";
import SelectInstrument from "./SelectInstrument";
import InstrumentDetail from "./InstrumentDetail";

function formatDate(value) {
  if (typeof value == "number") {
    value = new Date(value);
  }
  return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(
    2,
    "0"
  )}`;
}

function Overview() {
  const [selectedInstrument, setSelectedInstrument] = useState(instruments[0]);

  const onInstrumentsSelected = (instruments) => {
    setSelectedInstrument(instruments[0]);
    console.log(selectedInstrument);
  };

  const x = selectedInstrument.prices.map((value) => value.date);
  const y = selectedInstrument.prices.map((value) => value.price);

  return (
    <>
      <h1 className="text-lg">Bond Overview</h1>
      <div>
        <SelectInstrument
          instruments={instruments}
          onInstrumentsSelected={onInstrumentsSelected}
        ></SelectInstrument>
      </div>
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
          xAxis={[
            {
              id: "date",
              data: x,
              valueFormatter: (value) => formatDate(value),
            },
          ]}
          series={[{ data: y }]}
          height={300}
        />
      </div>
      <div>
        <InstrumentDetail instrument={selectedInstrument}></InstrumentDetail>
      </div>
    </>
  );
}

export default Overview;
