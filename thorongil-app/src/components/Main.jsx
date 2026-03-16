import { Outlet } from "react-router";
import Navbar from "./core/Navbar";
import Footer from "./core/Footer";
import { Container, Box } from "@mui/material";

const layoutStyle = {
  display: "flex",
  flexDirection: "column",
  minHeight: "100vh",
};

function Main() {
  return (
    <Box sx={layoutStyle}>
      <Navbar />
      <Box component="main" sx={{ flex: 1, py: 2 }}>
        <Container maxWidth="xl">
          <Outlet />
        </Container>
      </Box>
      <Footer />
    </Box>
  );
}

export default Main;
