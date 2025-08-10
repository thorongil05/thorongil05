import { useState } from "react";
import Navbar from "./components/Navbar";
import "./App.css";
import Card from "./components/Card";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Navbar></Navbar>
      <div className="grid grid-cols-4 gap-10 p-4">
        <Card
          title="Tokyo"
          description="Test"
          imgUrl="https://plus.unsplash.com/premium_photo-1661914240950-b0124f20a5c1?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        ></Card>
        <Card
          title="Rome"
          description="Test"
          imgUrl="https://plus.unsplash.com/premium_photo-1675975706513-9daba0ec12a8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Um9tZXxlbnwwfHwwfHx8MA%3D%3D"
        ></Card>
        <Card
          title="New York"
          description="Test"
          imgUrl="https://plus.unsplash.com/premium_photo-1714051660720-888e8454a021?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8TmV3JTIwWW9ya3xlbnwwfHwwfHx8MA%3D%3D"
        ></Card>
        <Card
          title="Paris"
          description="Test"
          imgUrl="https://plus.unsplash.com/premium_photo-1661919210043-fd847a58522d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8UGFyaXN8ZW58MHx8MHx8fDA%3D"
        ></Card>
      </div>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
    </>
  );
}

export default App;
