import { useEffect, useState } from "react";

export default function Notificaciones() {
  const [notificaciones, setNotificaciones] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("notificaciones")) || [];
    setNotificaciones(data);
  }, []);

  return (
    <div>
      <h2>Notificaciones</h2>

      {notificaciones.length === 0 && (
        <p>No hay notificaciones</p>
      )}

      {notificaciones.map((n, index) => (
        <div
          key={index}
          style={{
            background: "#fff",
            padding: "15px",
            marginBottom: "10px",
            borderLeft: `5px solid ${
              n.tipo === "pago"
                ? "red"
                : n.tipo === "asamblea"
                ? "blue"
                : n.tipo === "multa"
                ? "orange"
                : "green"
            }`,
          }}
        >
          <strong>{n.tipo.toUpperCase()}</strong>
          <p>{n.mensaje}</p>
          <small>{n.fecha}</small>
        </div>
      ))}
    </div>
  );
}
