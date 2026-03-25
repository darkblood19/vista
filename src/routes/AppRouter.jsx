import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Notificaciones from "../pages/Notificaciones";
import Asambleas from "../pages/Asambleas";
import Multas from "../pages/Multas";
import Login from "../pages/Login";
import Confirm from "../pages/Confirm";
import DashboardLayout from "../layouts/DashboardLayout";
import MensajesDeptos from "../pages/MensajesDeptos";

import Personas from "../pages/Personas";
import Carros from "../pages/Carros";
import Controles from "../pages/Controles";
import Pagos from "../pages/Pagos";
import Gastos from "../pages/Gastos";
import Reportes from "../pages/Reportes";

function AppRouter() {
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setAuth(true);
    }
  }, []);

  // Allow the confirmation route to be accessed without being authenticated
  const pathname = typeof window !== "undefined" ? window.location.pathname : "";
  if (pathname.startsWith("/confirm")) {
    return <Confirm />;
  }

  if (!auth) {
    return <Login onLogin={() => setAuth(true)} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DashboardLayout />}>
            <Route path="/" element={<Navigate to="/personas" />} />
            <Route path="/personas" element={<Personas />} />
            <Route path="/carros" element={<Carros />} />
            <Route path="/controles" element={<Controles />} />
            <Route path="/pagos" element={<Pagos />} />
            <Route path="/gastos" element={<Gastos />} />
            <Route path="/reportes" element={<Reportes />} />
            <Route path="/notificaciones" element={<Notificaciones />} />
            <Route path="/asambleas" element={<Asambleas />} />
            <Route path="/multas" element={<Multas />} />
            <Route path="/mensajes-deptos" element={<MensajesDeptos />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
