import { BrowserRouter, Routes, Route } from "react-router-dom";
import Inicio from "./pages/registrioInicio";
import Registro from "./pages/registroPage";
import Login from "./pages/registroLogin";
import Admin from "./pages/registroAdmin";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter basename="/talleres">
      <Navbar />
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
