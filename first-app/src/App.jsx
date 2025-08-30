import Navbar from "./components/Navbar";
import "./App.css";
import Overview from "./components/Overview";

function handleClick() {
  alert("Test");
}

function handleChange(e) {
  console.log(e.target.value);
}

function handleSubmit(e) {
  e.preventDefault();
  console.log(e);
}

function App() {
  return (
    <>
      <Navbar></Navbar>
      <Overview></Overview>
    </>
  );
}

export default App;
