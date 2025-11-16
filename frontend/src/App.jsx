import { Routes, Route, Link } from "react-router-dom";
import PendientesEncargado from "./pages/PendientesEncargado.jsx";
import DetallePractica from "./pages/DetallePractica.jsx";

function App() {
  return (
    <div style={{ padding: 20 }}>
      <header style={{ marginBottom: 20 }}>
        <h1>Gestión de Prácticas - Encargado</h1>
        <nav>
          <Link to="/">Pendientes</Link>
        </nav>
        <hr />
      </header>

      <Routes>
        <Route path="/" element={<PendientesEncargado />} />
        <Route path="/practica/:id" element={<DetallePractica />} />
      </Routes>
    </div>
  );
}

export default App;