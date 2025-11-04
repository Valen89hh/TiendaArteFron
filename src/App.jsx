import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GaleriasList from "./pages/GaleriasList";
import CreateGaleria from "./pages/CreateGaleria";
import EditGaleria from "./pages/EditGaleria";

import ObrasList from "./pages/ObrasList";
import CreateObra from "./pages/CreateObra"; // 🔥 IMPORTANTE
import EditObra from "./pages/EditObra";

function App() {
  return (
    <Router>
      <Routes>
        {/* Galerías */}
        <Route path="/" element={<GaleriasList />} />
        <Route path="/galerias/new" element={<CreateGaleria />} />
        <Route path="/galerias/edit/:id" element={<EditGaleria />} />

        {/* Obras */}
        <Route path="/obras" element={<ObrasList />} />
        <Route path="/obras/new" element={<CreateObra />} />
        <Route path="/obras/edit/:id" element={<EditObra />} />
      </Routes>
    </Router>
  );
}

export default App;
