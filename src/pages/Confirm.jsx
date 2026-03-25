import { useEffect, useState } from "react";

function Confirm() {
  const [status, setStatus] = useState("Verificando...");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (!token) {
      setStatus("Token no proporcionado.");
      return;
    }

    fetch(`/api/confirm?token=${encodeURIComponent(token)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data?.ok) setStatus("Cuenta confirmada. Puedes iniciar sesión.");
        else setStatus(data?.message || "Error al confirmar la cuenta.");
      })
      .catch(() => setStatus("Error de conexión al confirmar."));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Confirmación de correo</h2>
      <p>{status}</p>
      <p>
        <a href="/">Ir al inicio</a>
      </p>
    </div>
  );
}

export default Confirm;
