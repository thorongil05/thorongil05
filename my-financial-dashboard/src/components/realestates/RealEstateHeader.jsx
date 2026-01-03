import PropTypes from "prop-types";
import { ScatterChart } from "@mui/x-charts/ScatterChart";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";

function RealEstateHeader({ realEstatesInfo }) {
  let series = realEstatesInfo.map((element) => ({
    id: element.id,
    x: element.price,
    y: element.area,
  }));
  return (
    <Grid container spacing={2}>
      <Grid size={4}>
        <Card variant="outlined">
          <CardHeader title="Relazione Costo/Metratura"></CardHeader>
          <CardContent>
            <ScatterChart
              height={200}
              series={[
                {
                  label: "Series A",
                  data: series,
                },
              ]}
            />
          </CardContent>
        </Card>
      </Grid>
      <Grid size={4}>
        <Card variant="outlined">
          <CardHeader title="Statistiche Varie"></CardHeader>
        </Card>
      </Grid>
    </Grid>
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
