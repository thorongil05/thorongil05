import Navbar from "./components/Navbar";
import "./App.css";
import Home from "./components/Home";
import { Route, Routes } from "react-router";
import RealEstatesView from "./components/realestates/RealEstatesView";
import MortgagesView from "./components/mortgages/MortgagesView";
import Main from "./components/Main";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Main></Main>}>
        <Route path="/bonds" element={<Home></Home>}></Route>
        <Route
          path="/mortgages"
          element={<MortgagesView></MortgagesView>}
        ></Route>
        <Route
          path="/real-estates"
          element={<RealEstatesView></RealEstatesView>}
        ></Route>
      </Route>
    </Routes>
  );
}

export default App;
