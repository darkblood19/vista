import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Notificaciones from "../pages/Notificaciones";
import Asambleas from "../pages/Asambleas";
import Multas from "../pages/Multas";
import Login from "../pages/Login";
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
    const isAuth = localStorage.getItem("auth");
    if (isAuth === "true") {
      setAuth(true);
    }
  }, []);

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
