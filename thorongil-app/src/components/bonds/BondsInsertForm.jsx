import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { useState } from "react";

function BondsInsertForm() {
  const [formData, _setFormData] = useState({
    type: "",
    address: "",
    location: "",
    city: "",
    price: 0,
    area: 0,
    referenceDate: new Date(),
  });

  return (
    <Stack direction="row" className="m-3" spacing={2}>
      <TextField
        size="small"
        label="Price"
        type="number"
        name="price"
        value={formData.price}
        onChange={() => {}}
      ></TextField>
    </Stack>
  );
}

export default BondsInsertForm;
