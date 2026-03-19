import { Outlet } from "react-router";
import { Container, Box } from "@mui/material";

function Main() {
  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Container maxWidth="xl" sx={{ py: 2 }}>
        <Outlet />
      </Container>
    </Box>
  );
}

export default Main;
