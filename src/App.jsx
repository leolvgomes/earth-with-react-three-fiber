import { Navigate, Route, Routes } from "react-router-dom";
import EarthPage from "./pages/EarthPage";
import MoonPage from "./pages/MoonPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<EarthPage />} />
      <Route path="/lua" element={<MoonPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
