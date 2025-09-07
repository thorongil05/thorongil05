import PropTypes from "prop-types";

function SelectInstrument({ instruments, onInstrumentsSelected }) {
  return (
    <select
      className="bg-gray-800"
      multiple={true}
      onChange={(e) => {
        const options = [...e.target.selectedOptions];
        const values = options.map((option) => option.index);
        let selectedInstruments = [];
        values.forEach((index) => {
          selectedInstruments.push(instruments[index]);
        });
        onInstrumentsSelected(selectedInstruments);
      }}
    >
      {instruments.map((element, index) => (
        <option className="m-2" key={element.id} value={index}>
          {element.name}
        </option>
      ))}
    </select>
  );
}

SelectInstrument.propTypes = {
  instruments: PropTypes.array.isRequired,
  onInstrumentsSelected: PropTypes.func.isRequired,
};

export default SelectInstrument;
