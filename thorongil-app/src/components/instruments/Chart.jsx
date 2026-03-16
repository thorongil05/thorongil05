import { axisClasses } from "@mui/x-charts/ChartsAxis";
import { LineChart } from "@mui/x-charts";
import PropTypes from "prop-types";

function formatDate(value) {
  if (typeof value == "number") {
    value = new Date(value);
  }
  return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(
    2,
    "0"
  )}`;
}

function InstrumentsLineChart({ instrumentsToDisplay }) {
  if (instrumentsToDisplay === undefined) {
    return <>Nessun elemento visibile</>;
  }

  let x = instrumentsToDisplay
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

  let y = instrumentsToDisplay
    .map((instrument) => instrument.prices)
    .map((value) => ({
      data: value.map((t) => t.price),
    }));

  if (x.length == 0 || y.length == 0) {
    // Let's avoid to send empty lists to the library chart component in order to avoid weird behaviors
    return <>Nessun elemento visibile</>;
  }

  return (
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
  );
}

InstrumentsLineChart.propTypes = {
  instrumentsToDisplay: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      prices: PropTypes.arrayOf(
        PropTypes.shape({
          date: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.instanceOf(Date),
          ]).isRequired,
          price: PropTypes.number.isRequired,
        })
      ).isRequired,
    })
  ).isRequired,
};

export default InstrumentsLineChart;
