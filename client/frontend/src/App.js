import { Routes, Route } from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";
import Menu from "./Menu";
import AgregarEncargado from "./AgregarEncargado";
import CrearPiso from "./CrearPiso";
import Pisos from "./Pisos";
import ReporteFinanciero from './ReporteFinanciero';
import Bitacora from "./Bitacora";

export default function App() {
  return (
    <Routes>
      <Route exact path="/" element={<Login />} />
      <Route exact path="/login" element={<Login />} />
      <Route exact path="/signup" element={<Signup />} />
      <Route exact path="/menu" element={<Menu />} />
      <Route exact path="/agregar-encargado" element={<AgregarEncargado />} />
      <Route exact path="/crear-piso" element={<CrearPiso />} />
      <Route exact path="/pisos" element={<Pisos />} />
      <Route exact path="/reporte-financiero" element={<ReporteFinanciero />} />
      <Route exact path="/bitacora" element={<Bitacora />} />

  </Routes>
  );
}

