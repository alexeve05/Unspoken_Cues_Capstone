import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [apiMessage, setApiMessage] = useState("Checking backend...");

  useEffect(() => {
    fetch("http://localhost:3000/api/health")
      .then((response) => response.json())
      .then((data) => setApiMessage(data.message))
      .catch(() => setApiMessage("Unable to connect to backend"));
  }, []);

  return (
    <main>
      <h1>Unspoken Cues</h1>
      <h2>Resort/Event Management Platform</h2>

      <p>{apiMessage}</p>
    </main>
  );
}

export default App;