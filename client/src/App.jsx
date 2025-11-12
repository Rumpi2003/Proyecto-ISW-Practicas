import { useState } from "react";
import PendingList from "./components/PendingList.jsx";
import EvaluacionEditor from "./components/EvaluacionEditor.jsx";
import "./App.css";

export default function App() {
  const [picked, setPicked] = useState(null);

  return (
    <div className="max-w-4xl mx-auto">
      <header className="p-4 border-b mb-4">
        <h1 className="text-xl font-semibold">Portal Encargado de Practicas</h1>
      </header>

      {!picked ? (
        <PendingList onPick={setPicked} />
      ) : (
        <EvaluacionEditor id={picked} onBack={() => setPicked(null)} />
      )}
    </div>
  );
}
