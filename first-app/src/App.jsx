import { useState } from "react";
import Navbar from "./components/Navbar";
import "./App.css";
import Card from "./components/Card";
import { cities } from "./data/model";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Navbar></Navbar>
      <div className="grid grid-cols-4 gap-10 p-4">
        {cities
          .filter((city) => city.isVisited)
          .map((city) => (
            <Card
              key={city.id}
              title={city.title}
              description={city.description}
              isVisited={city.isVisited}
              imgUrl={city.imgUrl}
            />
          ))}
      </div>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
    </>
  );
}

export default App;
