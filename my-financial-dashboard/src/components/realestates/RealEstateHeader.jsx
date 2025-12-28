import PropTypes from "prop-types";
import { ScatterChart } from "@mui/x-charts/ScatterChart";

function RealEstateHeader({ realEstatesInfo }) {
  let series = realEstatesInfo.map((element) => ({
    id: element.id,
    x: element.price,
    y: element.area,
  }));
  return (
    <ScatterChart
      height={300}
      series={[
        {
          label: "Series A",
          data: series,
        },
      ]}
    />
  );
}

RealEstateHeader.propTypes = {
  realEstatesInfo: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      price: PropTypes.number.isRequired,
      area: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default RealEstateHeader;
