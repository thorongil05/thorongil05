import PropTypes from "prop-types";
import "./SelectInstrument.css";
import { useState } from "react";

function InstrumentSelector({ instrument, onSelect, onUnselect }) {
  const [selected, setSelected] = useState(false);
  return (
    <div className="text-left">
      <button
        className={`clickable ${selected ? "selected" : ""}`}
        onClick={() => {
          let newSelectionValue = !selected;
          setSelected(newSelectionValue);
          if (newSelectionValue) {
            onSelect(instrument);
          } else {
            onUnselect(instrument);
          }
        }}
      >
        {instrument.name}
      </button>
      {selected}
    </div>
  );
}

function SelectInstrument({ instruments, onInstrumentsSelected }) {
  const [selectedInstruments, setSelectedInstruments] = useState([]);

  const onSelect = (selectedInstrument) => {
    setSelectedInstruments((prev) => [...prev, selectedInstrument]);
  };

  const onUnselect = (unselectedInstrument) => {
    setSelectedInstruments((prev) =>
      prev.filter((element) => element != unselectedInstrument)
    );
  };

  onInstrumentsSelected(selectedInstruments);

  return (
    <>
      <h1 className="text-left text-xl mb-2 font-medium">Instruments</h1>
      {instruments.map((element) => (
        <InstrumentSelector
          key={element.id}
          instrument={element}
          onSelect={onSelect}
          onUnselect={onUnselect}
        />
      ))}
    </>
  );
}

SelectInstrument.propTypes = {
  instruments: PropTypes.array.isRequired,
  onInstrumentsSelected: PropTypes.func.isRequired,
};

InstrumentSelector.propTypes = {
  instrument: PropTypes.element.isRequired,
  onSelect: PropTypes.func.isRequired,
  onUnselect: PropTypes.func.isRequired,
};

export default SelectInstrument;
