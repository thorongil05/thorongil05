import "./App.css";
import Home from "./components/instruments/Home";
import { Route, Routes } from "react-router";
import RealEstatesView from "./components/realestates/RealEstatesView";
import MortgagesView from "./components/mortgages/MortgagesView";
import Main from "./components/Main";
import FootballArchiveView from "./components/football-archive/FootballArchiveView";
import BondsView from "./components/bonds/BondsView";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Main></Main>}>
        <Route path="/instruments" element={<Home></Home>}></Route>
        <Route path="/bonds" element={<BondsView></BondsView>}></Route>
        <Route
          path="/mortgages"
          element={<MortgagesView></MortgagesView>}
        ></Route>
        <Route
          path="/real-estates"
          element={<RealEstatesView></RealEstatesView>}
        ></Route>
        <Route
          path="/football-archive"
          element={<FootballArchiveView></FootballArchiveView>}
        ></Route>
      </Route>
    </Routes>
  );
}

export default App;
