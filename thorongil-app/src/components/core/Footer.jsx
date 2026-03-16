import React from "react";
import Stack from "@mui/material/Stack";
import packageJson from "../../../package.json";

function Footer() {
  return (
    <Stack>
      <p>Version {packageJson.version}</p>
    </Stack>
  );
}

export default Footer;
