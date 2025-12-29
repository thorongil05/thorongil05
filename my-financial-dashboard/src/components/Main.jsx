import { Outlet } from "react-router";
import Navbar from "./Navbar";

const layoutStyle = {
  display: "flex",
  flexDirection: "column",
  minHeight: "100vh",
};

const mainStyle = { flex: 1, padding: "2rem" };

function Main() {
  return (
    <div style={layoutStyle}>
      <Navbar></Navbar>
      <div style={mainStyle}>
        <Outlet></Outlet>
      </div>
      <div>Lo zanda</div>
    </div>
  );
}

export default Main;
