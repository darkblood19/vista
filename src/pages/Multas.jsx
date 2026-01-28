import { useState } from "react";
import { agregarNotificacion } from "../utils/notificaciones";

export default function Multas() {
  const [nombre, setNombre] = useState("");
  const [motivo, setMotivo] = useState("");

  const aplicarMulta = (e) => {
    e.preventDefault();

    agregarNotificacion(
      "multa",
      `Multa a ${nombre}: ${motivo}`
    );

    setNombre("");
    setMotivo("");
  };

  return (
    <div>
      <h2>Multas</h2>

      <form onSubmit={aplicarMulta}>
        <input
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />

        <input
          placeholder="Motivo"
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
          required
        />

        <button>Aplicar multa</button>
      </form>
    </div>
  );
}
