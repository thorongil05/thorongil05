import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { useState } from "react";
import PropTypes from "prop-types";

function submit(e, formData, onSubmitAction) {
  e.preventDefault();
  const apiUrl = `${import.meta.env.VITE_SERVER_URL}/api/real-estates/`;
  console.log("Calling submit on url", apiUrl);
  let options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  };
  console.log(JSON.stringify(options));
  fetch(apiUrl, options)
    .then((response) => {
      console.log(response.json());
      console.log("Success, executing on submit action");
      onSubmitAction();
    })
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error(error);
    });
}

function RealEstateInsertForm({ onInsert }) {
  const [formData, setFormData] = useState({
    type: "",
    address: "",
    location: "",
    city: "",
    price: 0,
    area: 0,
    referenceDate: new Date(),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form>
      <Stack direction="row" className="m-3" spacing={2}>
        <Autocomplete
          size="small"
          disablePortal
          options={["Villa", "Appartamento"]}
          sx={{ width: 300 }}
          name="type"
          value={formData.type}
          onChange={(_event, newValue) => {
            setFormData((prev) => ({ ...prev, type: newValue }));
          }}
          renderInput={(params) => <TextField {...params} label="Type" />}
        />
        <TextField
          size="small"
          label="Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
        ></TextField>
        <TextField
          size="small"
          label="Location"
          name="location"
          value={formData.location}
          onChange={handleChange}
        ></TextField>
        <TextField
          size="small"
          label="City"
          name="city"
          value={formData.city}
          onChange={handleChange}
        ></TextField>
        <TextField
          size="small"
          label="Price"
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
        ></TextField>
        <TextField
          size="small"
          label="Area"
          type="number"
          name="area"
          value={formData.area}
          onChange={handleChange}
        ></TextField>
        <Button type="submit" onClick={(e) => submit(e, formData, onInsert)}>
          Add
        </Button>
      </Stack>
    </form>
  );
}

RealEstateInsertForm.propTypes = {
  onInsert: PropTypes.func.isRequired,
};

export default RealEstateInsertForm;
