import { useState } from "react";
import { agregarNotificacion } from "../utils/notificaciones";

export default function Asambleas() {
  const [mensaje, setMensaje] = useState("");

  const crearAsamblea = (e) => {
    e.preventDefault();

    agregarNotificacion(
      "asamblea",
      `Nueva asamblea: ${mensaje}`
    );

    setMensaje("");
  };

  return (
    <div>
      <h2>Asambleas</h2>

      <form onSubmit={crearAsamblea}>
        <input
          placeholder="Detalle de la asamblea"
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          required
        />
        <button>Publicar</button>
      </form>
    </div>
  );
}
