import { Outlet } from "react-router";
import Navbar from "./core/Navbar";
import Footer from "./core/Footer";

const layoutStyle = {
  display: "flex",
  flexDirection: "column",
  minHeight: "100vh",
};

const mainStyle = { flex: 1, padding: "2rem 0 2rem 0" };

function Main() {
  return (
    <div style={layoutStyle}>
      <Navbar></Navbar>
      <div style={mainStyle}>
        <Outlet></Outlet>
      </div>
      <Footer></Footer>
    </div>
  );
}

export default Main;
