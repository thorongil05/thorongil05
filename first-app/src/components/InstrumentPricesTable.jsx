import PropTypes from "prop-types";

function InstrumentPricesTable({ prices }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Prezzo</th>
          <th>Data di rilevazione</th>
        </tr>
      </thead>
      <tbody>
        {prices.map((price) => (
          <tr key={price.date.toString() + price.price}>
            <td>{price.price}</td>
            <td>{price.date.toLocaleDateString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

InstrumentPricesTable.propTypes = {
  prices: PropTypes.arrayOf(
    PropTypes.shape({
      price: PropTypes.number.isRequired,
      date: PropTypes.instanceOf(Date).isRequired,
    })
  ).isRequired,
};

export default InstrumentPricesTable;
