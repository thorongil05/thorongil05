import Navbar from "./components/Navbar";
import "./App.css";
import Home from "./components/Home";
import { Route, Routes } from "react-router";
import RealEstatesView from "./components/realestates/RealEstatesView";
import MortgagesView from "./components/mortgages/MortgagesView";

function App() {
  return (
    <>
      <Navbar></Navbar>
      <Routes>
        <Route path="/bonds" element={<Home></Home>}></Route>
        <Route
          path="/mortgages"
          element={<MortgagesView></MortgagesView>}
        ></Route>
        <Route
          path="/real-estates"
          element={<RealEstatesView></RealEstatesView>}
        ></Route>
      </Routes>
    </>
  );
}

export default App;
