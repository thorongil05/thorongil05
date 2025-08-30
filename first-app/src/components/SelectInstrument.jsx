function SelectInstrument({ instruments }) {
  return (
    <select className="bg-gray-800" multiple={true}>
      {instruments.map((element) => (
        <option key={element.id}>{element.name}</option>
      ))}
    </select>
  );
}

export default SelectInstrument;
