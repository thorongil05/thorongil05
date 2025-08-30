import { LineChart } from "@mui/x-charts";
import { instruments } from "../data/model";
import { useState } from "react";
import { axisClasses } from "@mui/x-charts/ChartsAxis";
import SelectInstrument from "./SelectInstrument";

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

  function onClick(element) {
    setSelectedInstrument(element);
  }

  const x = selectedInstrument.prices.map((value) => value.date);
  const y = selectedInstrument.prices.map((value) => value.price);

  return (
    <>
      <h1 className="text-lg">Bond Overview</h1>
      <div>
        <SelectInstrument instruments={instruments}></SelectInstrument>
        {instruments.map((element) => (
          <div key={element.id}>
            {element.id == selectedInstrument.id && <span>✅</span>}
            <button onClick={() => onClick(element)}>{element.name}</button>
          </div>
        ))}
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
    </>
  );
}

export default Overview;
